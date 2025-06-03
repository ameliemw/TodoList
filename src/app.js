App = {
    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    loadWeb3: async () => {
        if (window.ethereum) {
            App.web3Provider = window.ethereum
            window.web3 = new Web3(window.ethereum)
            try {
                // Request account access
                await window.ethereum.request({method: 'eth_requestAccounts'})
            } catch (error) {
                alert('User denied account access.')
                return
            }
        } else if (window.web3) {
            App.web3Provider = window.web3.currentProvider
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            alert(
                'Non-Ethereum browser detected. You should consider trying MetaMask!'
            )
        }
    },
    loadAccount: async () => {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts',
            })
            if (!accounts || accounts.length === 0) {
                alert('No accounts found. Make sure MetaMask is connected.')
                return
            }
            App.account = accounts[0]
            console.log('Using account:', App.account)
        } catch (error) {
            console.error('Error loading accounts:', error)
        }
    },

    loadContract: async () => {
        // Create a JavaScript version of the smart contract
        const todoList = await $.getJSON('TodoList.json')
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3Provider)

        // Hydrate the smart contract with values from the blockchain
        App.todoList = await App.contracts.TodoList.deployed()
    },

    render: async () => {
        if (App.loading) return

        App.setLoading(true)

        // Render connected account (optional)
        $('#account').text(App.account)

        // Render tasks
        await App.renderTasks()

        App.setLoading(false)
    },

    renderTasks: async () => {
        const taskCount = await App.todoList.taskCount()
        const $taskTemplate = $('.taskTemplate')

        for (let i = 1; i <= taskCount; i++) {
            const task = await App.todoList.tasks(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]

            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate
                .find('input')
                .prop('name', taskId)
                .prop('checked', taskCompleted)

            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }

            $newTaskTemplate.show()
        }
    },

    createTask: async () => {
        App.setLoading(true)
        const content = $('#newTask').val()
        console.log('Creating task:', content)

        await App.todoList.createTask(content, {from: App.account})

        window.location.reload()
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    },
}

$(() => {
    $(window).on('load', () => {
        App.load()
    })
})
