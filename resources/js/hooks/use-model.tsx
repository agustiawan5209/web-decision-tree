import axios from 'axios';
import { DecisionTreeClassifier } from 'ml-cart';
import { useEffect, useState } from 'react';
export function useModel() {
    const [model, setModel] = useState<DecisionTreeClassifier | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModel = async () => {
            try {
                const response = await axios.get(route('DecisionTree.getModel'));

                if (response.status === 200) {
                    const jsonModel = JSON.parse(response.data.model);
                    const options = {
                        gainFunction: 'gini',
                        maxDepth: 3,
                        minNumSamples: 1,
                    };
                    const model = DecisionTreeClassifier.load(jsonModel);
                    setModel(model);
                    setIsLoading(false);
                }
            } catch {
                setError('Gagal Memuat Model dari sumber eksternal');
            }
        };

        fetchModel();
    }, []);
    return { model, isLoading, error };
}
