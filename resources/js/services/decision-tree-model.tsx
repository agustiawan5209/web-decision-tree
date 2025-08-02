import axios from 'axios';
import { DecisionTreeClassifier } from 'ml-cart';

interface LabelTypes {
  id: number;
  nama: string;
}

interface TrainingData {
  features: number[][];
  labelsY: number[];
  featureNames: string[];
  label: LabelTypes[];
}

interface SplitData {
  trainFeatures: number[][];
  trainLabelsY: number[];
  testFeatures: number[][];
  testLabelsY: number[];
}

interface PredictionResult {
  prediction: number | number[] | null;
  label: string | string[] | null;
  error: string | null;
}

interface ModelOptions {
  gainFunction: 'gini' | 'gain' | 'gainRatio';
  maxDepth: number;
  minNumSamples: number;
}

interface OperationState<T = any> {
  isLoading: boolean;
  error: string | null;
  data?: T;
}

interface DecisionTreeStates {
  dataLoading: OperationState<TrainingData>;
  modelLoading: OperationState<DecisionTreeClassifier>;
  training: OperationState<void>;
  evaluation: OperationState<{ accuracy: number; confusionMatrix?: number[][] }>;
  prediction: OperationState<PredictionResult>;
  saving: OperationState<void>;
}

class DecisionTreeModel {
  private trainingData: TrainingData | null = null;
  private splitData: SplitData = {
    trainFeatures: [],
    trainLabelsY: [],
    testFeatures: [],
    testLabelsY: [],
  };
  private treeModel: DecisionTreeClassifier | null = null;
  private states: DecisionTreeStates = {
    dataLoading: { isLoading: false, error: null },
    modelLoading: { isLoading: false, error: null },
    training: { isLoading: false, error: null },
    evaluation: { isLoading: false, error: null },
    prediction: { isLoading: false, error: null },
    saving: { isLoading: false, error: null },
  };

  // ==================== PUBLIC GETTERS ====================
  public getTrainingData(): TrainingData | null {
    return this.trainingData;
  }

  public getSplitData(): SplitData {
    return this.splitData;
  }

  public getTreeModel(): DecisionTreeClassifier | null {
    return this.treeModel;
  }
  public getTreeModelJson(){
    return this.treeModel?.toJSON();
  }

  public getDataLoadingState() { return this.states.dataLoading; }
  public getModelLoadingState() { return this.states.modelLoading; }
  public getTrainingState() { return this.states.training; }
  public getEvaluationState() { return this.states.evaluation; }
  public getPredictionState() { return this.states.prediction; }
  public getSavingState() { return this.states.saving; }

  // ==================== STATE MANAGEMENT ====================
  private setState<K extends keyof DecisionTreeStates>(
    key: K,
    update: Partial<OperationState<DecisionTreeStates[K]['data']>>
  ) {
    this.states[key] = { ...this.states[key], ...update };
  }

  private resetState<K extends keyof DecisionTreeStates>(key: K) {
    this.states[key] = { isLoading: false, error: null, data: undefined };
  }

  // ==================== CORE METHODS ====================
  public async fetchAndProcessData(): Promise<TrainingData> {
    this.setState('dataLoading', { isLoading: true, error: null });

    try {
      const response = await axios.get(route('api.DecisionTree.getData'));

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = response.data;
      const rawTraining: string[][] = data?.training ?? [];
      const rawKriteria: string[] = data?.kriteria ?? [];
      const labelOptions: LabelTypes[] = data?.label ?? [];

      if (rawTraining.length === 0 || rawKriteria.length === 0) {
        throw new Error('Data training atau kriteria dari API kosong');
      }

      // Process features and labels
      const features: number[][] = [];
      const labelsY: number[] = [];

      for (const row of rawTraining) {
        const featureRow = row.slice(0, -1).map(Number);
        features.push(featureRow);

        const labelName = row[row.length - 1];
        const labelId = labelOptions.find((label) => label.nama === labelName)?.id || 0;
        labelsY.push(labelId);
      }

      // Set training data
      const trainingData: TrainingData = {
        features,
        labelsY,
        featureNames: rawKriteria.slice(0, -1),
        label: labelOptions,
      };

      this.trainingData = trainingData;
      this.splitData = this.splitDataTraining(features, labelsY, 0.8);

      this.setState('dataLoading', {
        isLoading: false,
        data: trainingData
      });

      return trainingData;
    } catch (err) {
      const errorMsg = 'Gagal memuat dataset: ' + (err as Error).message;
      this.setState('dataLoading', {
        isLoading: false,
        error: errorMsg
      });
      throw new Error(errorMsg);
    }
  }

  private splitDataTraining(
    features: number[][],
    labelsY: number[],
    splitRatio = 0.7
  ): SplitData {
    const shuffledIndices = features.map((_, i) => i).sort(() => Math.random() - 0.5);
    const splitIndex = Math.floor(features.length * splitRatio);

    return {
      trainFeatures: shuffledIndices.slice(0, splitIndex).map((i) => features[i]),
      trainLabelsY: shuffledIndices.slice(0, splitIndex).map((i) => labelsY[i]),
      testFeatures: shuffledIndices.slice(splitIndex).map((i) => features[i]),
      testLabelsY: shuffledIndices.slice(splitIndex).map((i) => labelsY[i]),
    };
  }

  public async loadModel(): Promise<DecisionTreeClassifier> {
    this.setState('modelLoading', { isLoading: true, error: null });

    try {
      const response = await axios.get(route('DecisionTree.getModel'));

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }

      const jsonModel = JSON.parse(response.data.model);
      this.treeModel = DecisionTreeClassifier.load(jsonModel);

      this.setState('modelLoading', {
        isLoading: false,
        data: this.treeModel
      });

      return this.treeModel;
    } catch (err) {
      const errorMsg = 'Gagal memuat model: ' + (err as Error).message;
      this.setState('modelLoading', {
        isLoading: false,
        error: errorMsg
      });
      throw new Error(errorMsg);
    }
  }

  public async trainModel(options?: Partial<ModelOptions>): Promise<void> {
    this.setState('training', { isLoading: true, error: null });

    try {
      if (!this.trainingData || this.trainingData.features.length === 0) {
        throw new Error('Training data tidak tersedia atau kosong');
      }

      const defaultOptions: ModelOptions = {
        gainFunction: 'gini',
        maxDepth: 3,
        minNumSamples: 1,
        ...options
      };

      const classifier = new DecisionTreeClassifier(defaultOptions);
      classifier.train(this.trainingData.features, this.trainingData.labelsY);
      this.treeModel = classifier;

      this.setState('training', { isLoading: false });
    } catch (err) {
      const errorMsg = 'Gagal melatih model: ' + (err as Error).message;
      this.setState('training', {
        isLoading: false,
        error: errorMsg
      });
      throw new Error(errorMsg);
    }
  }

  public async evaluateModel(): Promise<{ accuracy: number; confusionMatrix: number[][] }> {
    this.setState('evaluation', { isLoading: true, error: null });

    try {
      if (!this.treeModel || !this.splitData) {
        throw new Error('Model atau data split tidak tersedia');
      }

      const predictions = this.treeModel.predict(this.splitData.testFeatures);
      const uniqueLabels = [...new Set(this.splitData.testLabelsY)].sort((a, b) => a - b);

      // Hitung akurasi
      let correct = 0;
      for (let i = 0; i < predictions.length; i++) {
        if (predictions[i] === this.splitData.testLabelsY[i]) {
          correct++;
        }
      }
      const accuracy = correct / predictions.length;

      // Buat confusion matrix
      const confusionMatrix = uniqueLabels.map(() =>
        uniqueLabels.map(() => 0)
      );

      for (let i = 0; i < predictions.length; i++) {
        const actualIdx = uniqueLabels.indexOf(this.splitData.testLabelsY[i]);
        const predictedIdx = uniqueLabels.indexOf(predictions[i]);
        confusionMatrix[actualIdx][predictedIdx]++;
      }

      const result = { accuracy, confusionMatrix };

      this.setState('evaluation', {
        isLoading: false,
        data: result
      });

      return result;
    } catch (err) {
      const errorMsg = 'Gagal mengevaluasi model: ' + (err as Error).message;
      this.setState('evaluation', {
        isLoading: false,
        error: errorMsg
      });
      throw new Error(errorMsg);
    }
  }

  public async predict(features: number[] | number[][]): Promise<PredictionResult> {
    this.setState('prediction', { isLoading: true, error: null });

    try {
      if (!this.treeModel) throw new Error('Model belum dimuat');
      if (!this.trainingData) throw new Error('Data training tidak tersedia');

      // Validasi input features
      const featuresArray = Array.isArray(features[0]) ?
        features as number[][] :
        [features] as number[][];

      if (featuresArray[0].length !== this.trainingData.features[0]?.length) {
        throw new Error(`Jumlah fitur tidak sesuai. Diharapkan: ${this.trainingData.features[0]?.length}`);
      }

      const predictions = this.treeModel.predict(featuresArray);

      const labelNames = predictions.map(id =>
        this.trainingData!.label.find(l => l.id === id)?.nama || 'Unknown'
      );

      const result: PredictionResult = {
        prediction: predictions.length === 1 ? predictions[0] : predictions,
        label: labelNames.length === 1 ? labelNames[0] : labelNames,
        error: null
      };

      this.setState('prediction', {
        isLoading: false,
        data: result
      });

      return result;
    } catch (err) {
      const errorMsg = 'Prediksi gagal: ' + (err as Error).message;
      this.setState('prediction', {
        isLoading: false,
        error: errorMsg
      });
      throw new Error(errorMsg);
    }
  }

  public async saveModel(): Promise<void> {
    this.setState('saving', { isLoading: true, error: null });

    try {
      if (!this.treeModel) {
        throw new Error('Tidak ada model yang tersedia untuk disimpan');
      }

      const response = await axios.post(route('DecisionTree.store'), {
        model: JSON.stringify(this.treeModel),
      });

      if (response.status !== 200) {
        throw new Error(`Gagal menyimpan model: ${response.statusText}`);
      }

      this.setState('saving', { isLoading: false });
    } catch (err) {
      const errorMsg = 'Gagal menyimpan model: ' + (err as Error).message;
      this.setState('saving', {
        isLoading: false,
        error: errorMsg
      });
      throw new Error(errorMsg);
    }
  }
}

export default DecisionTreeModel;
