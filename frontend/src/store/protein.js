import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axios from 'axios';
const DEFAULT_RESIDUES = 8;
export const useProteinStore = defineStore('protein', () => {
    const loading = ref(false);
    const result = ref(null);
    const selectedConformation = ref(null);
    const selectedCluster = ref('all');
    // 共享状态的唯一出处：各区块统一从这里取值，不再各自复制判断
    const hasResult = computed(() => result.value !== null);
    const conformations = computed(() => result.value?.conformations ?? []);
    const filteredConformations = computed(() => conformations.value.filter(c => selectedCluster.value === 'all' || c.cluster === selectedCluster.value));
    const residues = computed(() => result.value?.params.residues ?? DEFAULT_RESIDUES);
    async function runSampling(params) {
        loading.value = true;
        try {
            const { data } = await axios.post('/api/sample', params);
            result.value = data;
            selectedConformation.value = null;
            selectedCluster.value = 'all';
        }
        finally {
            loading.value = false;
        }
    }
    function selectConformation(conf) { selectedConformation.value = conf; }
    function filterByCluster(cluster) { selectedCluster.value = cluster; }
    return {
        loading, result, selectedConformation, selectedCluster,
        hasResult, conformations, filteredConformations, residues,
        runSampling, selectConformation, filterByCluster,
    };
});
