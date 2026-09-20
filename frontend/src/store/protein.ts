import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { Conformation, SamplingResult, ProteinParams } from '@/types'

const DEFAULT_RESIDUES = 8

export const useProteinStore = defineStore('protein', () => {
  const loading = ref(false)
  const result = ref<SamplingResult | null>(null)
  const selectedConformation = ref<Conformation | null>(null)
  const selectedCluster = ref('all')

  // 统一的派生取值：结果列表与各区块共用，缺失时走统一默认
  const hasResult = computed(() => result.value !== null)
  const conformations = computed<Conformation[]>(() => result.value?.conformations ?? [])
  const filteredConformations = computed(() =>
    conformations.value.filter(c => selectedCluster.value === 'all' || c.cluster === selectedCluster.value)
  )
  const residues = computed(() => result.value?.params.residues ?? DEFAULT_RESIDUES)

  async function runSampling(params: ProteinParams) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/sample', params)
      result.value = data
      selectedConformation.value = null
      selectedCluster.value = 'all'
    } finally { loading.value = false }
  }

  function selectConformation(conf: Conformation) { selectedConformation.value = conf }
  function filterByCluster(cluster: string) { selectedCluster.value = cluster }

  return {
    loading, result, selectedConformation, selectedCluster,
    hasResult, conformations, filteredConformations, residues,
    runSampling, selectConformation, filterByCluster,
  }
})
