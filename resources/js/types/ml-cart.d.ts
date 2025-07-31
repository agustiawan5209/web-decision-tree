// types/ml-cart.d.ts

declare module 'ml-cart' {
  interface DecisionTreeOptions {
    /** Maksimal kedalaman pohon. */
    maxDepth?: number;
    /** Jumlah minimal sampel untuk membagi node. */
    minNumSamples?: number;
  }

  export class DecisionTreeClassifier {
    /**
     * @param options - Opsi untuk Decision Tree Classifier.
     */
    constructor(options?: DecisionTreeOptions);

    /**
     * Melatih model dengan data fitur dan label.
     * @param features - Array 2D berisi data fitur, misal: [[0, 1], [2, 3]].
     * @param labels - Array berisi label numerik, misal: [0, 1].
     */
    train(features: number[][], labels: number[]): void;

    /**
     * Memprediksi label untuk data fitur baru.
     * @param features - Array 2D berisi data fitur yang akan diprediksi.
     * @returns Array berisi label hasil prediksi.
     */
    predict(features: number[][]): number[];

    /**
     * Mengekspor model ke format JSON.
     */
    toJSON(): object;

    /**
     * Memuat model dari objek JSON.
     * @param model - Objek model yang diekspor dari toJSON().
     */
    static load(model: object): DecisionTreeClassifier;
  }

  export class DecisionTreeRegression {
    constructor(options?: DecisionTreeOptions);
    train(features: number[][], labels: number[]): void;
    predict(features: number[][]): number[];
    toJSON(): object;
    static load(model: object): DecisionTreeRegression;
  }
}
