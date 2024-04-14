import { defineStore } from 'pinia'
import { ref } from 'vue'

const useUserStore = defineStore('user', () => {
    const user = ref({})
    function changeUser(value) {
        user.value = value
    }

    return {
        user,
        changeUser
    }
}, {
    persist: true // 开启数据持久化
})

export default useUserStore