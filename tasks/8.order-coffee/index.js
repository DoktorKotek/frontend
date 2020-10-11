/**
 В задании будем делать интерфейс заказа кофе. Интерфейс работает так: есть форма выбора желаемого напитка, есть кнопка "Добавить напиток", которая добавляет на страницу еще одну такую же форму заказа. Под формой есть кнопка "Готово" после нажатия на которую, появляется модальное окно с информацией о заказе.
 
 Сделай так, чтобы при клике по кнопке "Добавить напиток" появлялась еще одна форма выбора напитка. Текст в заголовке "Напиток №{номер по порядку}" должен соответствовать номеру формы.
 
 Добавь в правом верхнем углу каждого fieldset с напитком кнопку — крестик удаления. При клике по ней этот напиток должен убираться с экрана. Эта кнопка не должна работать, если напиток единственный.
 
 Сделай, чтобы при нажатии на кнопку "Готово", появлялось модальное окно с текстом "Заказ принят!". Напоминаю правила модального окна:
 
 у него должна быть фиксированная ширина (можешь выбрать сам, например, 500px — хороший размер),
 высота должна подстраиваться под контент,
 размещаться должно ровно посередине экрана,
 под окном и над контентом страницы должен располагаться оверлей — затемненный полупрозрачный фон,
 справа сверху в модальном окне должна быть кнопка закрытия с крестиком.
 Сделай, чтобы у модального окна был крестик для закрытия и при нажатии на него, модальное окно исчезало.
 
 Сделай так, чтобы в модальном окне выводился текст "Вы заказали {количество} напитков". В этом тексте должно быть подставленно актуальное количество напитков, которые выбрал пользователь. Сделай так, чтобы слово "напитков" склонялось в зависимости от количества: "1 напиток", "3 напитка", "5 напитков", "121 напиток".
 
 Сделай в модальном окне, ниже надписи про количество напитков, таблицу такого вида:
 
 Напиток | Молоко | Дополнительно
 
 Капучино  |  обычное  |
 Какао     |  соевое   |  зефирки, шоколад
 Данные для таблицы нужно получить из заполненной формы на странице.
 
 *Добавь в формы выбора напитка textarea с возможностью написать любой текст. Поле должно быть подписано "И еще вот что" Рядом с textarea должен выводиться текст, написанный в ней пользователем: на каждое изменение текста в поле, текст рядом тоже должен изменяться. Если в тексте введенном пользователем есть слова "срочно", "быстрее"/"побыстрее", "скорее"/"поскорее", "очень нужно", эти слова должны помещаться в тег b. Например, так:
 Текст пользователя: Сделайте мне капучино побыстрее! Очень нужно!
 
 Результат вывода: Сделайте мне капучино <b>побыстрее</b>! <b>Очень нужно</b>!
 
 *Добавь в таблицу модального окна колонку "Пожелания", которую заполняй текстом из textarea.
 
 *Сделай в модальном окне поле input с типом time и подписью "Выберите время заказа". Внизу модального окна добавь кнопку "Оформить". После нажатия на кнопку нужно проверить, если выбрано время раньше, чем текущее время, то покрасить границу поля ввода времени в красный, вывести alert с текстом "Мы не умеем перемещаться во времени. Выберите время позже, чем текущее". Если время введено правильно, то по нажатию на кнопку "Оформить" закрывай модалку.
 */

const State = {
    items: [],
}

const TYPES = [
    { value: 'espresso', label: 'Эспрессо' },
    { value: 'capuccino', label: 'Капучино', default: true },
    { value: 'cacao', label: 'Какао' },
]
const MILKS = [
    { value: 'usual', label: 'обычном молоке', default: true },
    { value: 'no-fat', label: 'обезжиренном молоке' },
    { value: 'soy', label: 'соевом молоке' },
    { value: 'coconut', label: 'кокосовом молоке' },
]
const OPTIONS = [
    { value: 'whipped cream', label: 'взбитых сливок'},
    { value: 'marshmallow', label: 'зефирок' },
    { value: 'chocolate', label: 'шоколад' },
    { value: 'cinnamon', label: 'корицу' },
]
const BOLD_WORDS = ['срочно', 'быстрее', 'побыстрее', 'скорее', 'поскорее', 'очень нужно']
    .map(word => new RegExp(word, 'ig'))


class Coffee {
    constructor(type, milk, options) {
        this._type = type
        this._milk = milk
        this._options = new Set(options)
        this._comment = ''
    }
    
    get type() {
        return this._type
    }
    
    set type(value) {
        this._type = value
    }
    
    get milk() {
        return this._milk
    }
    
    set milk(value) {
        this._milk = value
    }
    
    set comment(value) {
        this._comment = value
    }
    get comment() {
        return this._comment
    }
    
    
    get options() {
        return this._options
    }

    addOption(value) {
        this._options.add(value)
    }
    
    removeOption(value) {
        this._options.delete(value)
    }
}

init()

function init() {
    const form = getForm()
    
    const add = createButtonAddDrink()
    const submit = createButtonSubmit()
    
    form.appendChild(add)
    form.appendChild(submit)
    
    createCoffee()
    render()
}

function getForm() {
    let form = document.querySelector('form')
    if (!form) {
        form = document.createElement('form')
        document.body.insertBefore(form, document.body.firstChild)
    }
    return form
}

function removeOldFieldSets() {
    const form = getForm()
    form.querySelectorAll('.beverage').forEach(node => node.remove())
}

function render() {
    removeOldFieldSets()
    
    State.items.forEach((coffee, index) => {
        const fieldset = crateFieldSet(coffee, index + 1)
        insertFieldSet(fieldset)
    })
}

function createTitleWithNumber(number) {
    const title = document.createElement('h4')
    title.classList.add('beverage-count')
    addText(title, `Напиток №${number}`)
    return title
}

function createTypeSelector(coffee) {
    const labelType = document.createElement('label')
    labelType.classList.add('field')
    const spanType = document.createElement('span')
    spanType.classList.add('label-text')
    addText(spanType, 'Я буду')
    const select = document.createElement('select')
    TYPES.forEach(type => {
        const option = document.createElement('option')
        option.setAttribute('value', type.value)
        if (coffee.type === type.value) {
            option.setAttribute('selected', '')
        }
        addText(option, type.label)
        select.appendChild(option)
    })
    select.addEventListener('change', (e) => {
        console.log(e)
        const index = e.target.options.selectedIndex
        coffee.type = TYPES[index].value
    })
    labelType.appendChild(spanType)
    labelType.appendChild(select)
    return labelType
}

function createMilkSelector(number, coffee) {
    const containerMilk = document.createElement('div')
    containerMilk.classList.add('field')
    const spanMilk = document.createElement('span')
    spanMilk.classList.add('checkbox-label')
    addText(spanMilk, 'Сделайте напиток на')
    containerMilk.appendChild(spanMilk)
    
    MILKS.forEach(milk => {
        const label = document.createElement('label')
        label.classList.add('checkbox-field')
        
        const input = document.createElement('input')
        input.setAttribute('type', 'radio')
        input.setAttribute('name', `milk${number}`)
        input.setAttribute('value', milk.value)
        if (coffee.milk === milk.value) {
            input.setAttribute('checked', '')
        }
        const span = document.createElement('span')
        addText(span, milk.label)
        label.appendChild(input)
        label.appendChild(span)
        
        input.addEventListener('click', e => {
            coffee.milk = e.target.value
        })
        
        containerMilk.appendChild(label)
    })
    return containerMilk
}

function createOptionsSelector(number, coffee) {
    const containerOptions = document.createElement('div')
    containerOptions.classList.add('field')
    const spanOption = document.createElement('span')
    spanOption.classList.add('checkbox-label')
    addText(spanOption, 'Добавьте к напитку:')
    containerOptions.appendChild(spanOption)
    
    OPTIONS.forEach(option => {
        const label = document.createElement('label')
        label.classList.add('checkbox-field')
        
        const input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        input.setAttribute('name', `options${number}`)
        input.setAttribute('value', option.value)
        if (coffee.options.has(option.value)) {
            input.checked = true
        }
        
        const span = document.createElement('span')
        addText(span, option.label)
        label.appendChild(input)
        label.appendChild(span)
        
        input.addEventListener('change', e => {
           const isChecked = e.target.checked
           if (isChecked) {
               coffee.addOption(option.value)
           } else {
               coffee.removeOption(option.value)
           }
        })
        
        containerOptions.appendChild(label)
    })
    return containerOptions
}

function createRemoveButton(number) {
    const remove = document.createElement('button')
    remove.classList.add('remove')
    remove.addEventListener('click', e => {
        e.preventDefault()
        if (State.items.length > 1) {
            State.items.splice(number - 1, 1)
            render()
        }
    })
    return remove
}

function replaceSpecialWords(text) {
    for (const regexp of BOLD_WORDS) {
        text = text.replace(regexp, match => `<b>${match}</b>`)
    }
    return text
}

function createTextarea(coffee) {
    const comment = document.createElement('span')
    comment.classList.add('text-area-comment')
    addHtml(comment, replaceSpecialWords(coffee.comment))
    
    const label = document.createElement('span')
    label.classList.add('text-area-label')
    addText(label, 'И еще вот что:')
    
    const textarea = document.createElement('textarea')
    textarea.value = coffee.comment
    textarea.addEventListener('keyup', event => {
        coffee.comment = event.target.value
        addHtml(comment, replaceSpecialWords(coffee.comment))
    })
    const box = document.createElement('div')
    const wrap = document.createElement('div')
    wrap.classList.add('text-area-wrapper')
    
    box.appendChild(label)
    box.appendChild(wrap)
    wrap.appendChild(textarea)
    wrap.appendChild(comment)
    
    return box
}

function crateFieldSet(coffee, number) {
    const fieldSet = document.createElement('fieldset')
    fieldSet.classList.add('beverage')

    fieldSet.appendChild(createTitleWithNumber(number))
    fieldSet.appendChild(createTypeSelector(coffee))
    fieldSet.appendChild(createMilkSelector(number, coffee))
    fieldSet.appendChild(createOptionsSelector(number, coffee))
    fieldSet.appendChild(createTextarea(coffee))
    fieldSet.appendChild(createRemoveButton(number))
    
    return fieldSet
}

function insertFieldSet(fieldset) {
    const form = getForm()
    const addButton = form.querySelector('.add-button-wrapper')
    form.insertBefore(fieldset, addButton)
}

function addText(node, text) {
    node.innerText = text
}

function addHtml(node, text) {
    node.innerHTML = text
}

function createButtonAddDrink() {
    const wrap = document.createElement('div')
    wrap.classList.add('add-button-wrapper')
    const button = document.createElement('button')
    button.classList.add('add-button')
    button.setAttribute('type', 'button')
    addText(button, '+ Добавить напиток')
    button.addEventListener('click', () => {
        createCoffee()
        render()
    })
    wrap.appendChild(button)
    return wrap
}

function createButtonSubmit() {
    const wrap = document.createElement('div')
    wrap.setAttribute('style', 'margin-top: 30px')
    const button = document.createElement('button')
    button.classList.add('submit-button')
    button.setAttribute('type', 'submit')
    addText(button, 'Готово')
    button.addEventListener('click', (e) => {
        e.preventDefault()
        showModal()
    })
    wrap.appendChild(button)
    return wrap
}

function createCoffee() {
    const defaultType = TYPES.find(type => type.default) || {}
    const defaultMilk = MILKS.find(type => type.default) || {}
    
    const coffee = new Coffee(defaultType.value, defaultMilk.value)
    State.items.push(coffee)
    return State.items.length
}

function createModal() {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    
    const overlay = document.createElement('div')
    overlay.classList.add('modal-overlay')
    
    const wrapper = document.createElement('div')
    wrapper.classList.add('modal-wrapper')
    
    const header = document.createElement('h3')
    header.classList.add('modal-header')
    addText(header, 'Заказ принят!')
    
    const content = document.createElement('div')
    content.classList.add('modal-content')
    
    const remove = document.createElement('button')
    remove.classList.add('remove')
    remove.classList.add('modal-remove')
    remove.addEventListener('click', (e) => {
        hideModal()
    })
    
    const form = getForm()
    form.parentNode.insertBefore(modal, form.parentNode.lastChild)
    
    modal.appendChild(overlay)
    overlay.appendChild(wrapper)
    wrapper.appendChild(header)
    wrapper.appendChild(content)
    wrapper.appendChild(remove)
}

function showModal() {
    const existedModal = document.querySelector('.modal')
    if (existedModal) {
        existedModal.style.display = null
    } else {
        createModal()
    }
    
    renderModalContent()
    
    document.body.style.overflow = 'hidden'
}

function hideModal() {
    const modal = document.querySelector('.modal')
    modal.style.display = 'none'
    
    document.body.style.overflow = null
}

function declination(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2]
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
}

function renderModalContent() {
    const content = document.querySelector('.modal-content')
    content.innerHTML = ''
    
    const coffeeCount = State.items.length
    
    const p = document.createElement('p')
    content.appendChild(p)
    addText(p, `Вы заказали ${coffeeCount} ${declination(coffeeCount, ['напиток', 'напитка', 'напитков'])}`)
    
    const table = document.createElement('table')
    table.classList.add('coffee-table')
    const tableHead = document.createElement('thead')
    tableHead.classList.add('coffee-head')
    const tableBody = document.createElement('tbody')
    tableBody.classList.add('coffee-body')
    
    table.appendChild(tableHead)
    table.appendChild(tableBody)
    content.appendChild(table)
    
    State.items.forEach(coffee => {
        const tr = document.createElement('tr')
        tableBody.appendChild(tr)
        
        const td1 = document.createElement('td')
        tr.appendChild(td1)
        const coffeeName = TYPES.find(type => coffee.type === type.value)
        addText(td1, coffeeName.label)
    
        const td2 = document.createElement('td')
        tr.appendChild(td2)
        const milkName = MILKS.find(type => coffee.milk === type.value)
        addText(td2, milkName.label)
    
        const td3 = document.createElement('td')
        tr.appendChild(td3);
        const optionString = [...coffee.options].map(el => {
            return OPTIONS.find(type => type.value === el).label
        }).join(', ')
        addText(td3, optionString)
    
        const td4 = document.createElement('td')
        tr.appendChild(td4)
        addHtml(td4, replaceSpecialWords(coffee.comment))
    })
    
    const dateTitle = document.createElement('p')
    content.appendChild(dateTitle)
    addText(dateTitle, 'Выберите время заказа')
    
    const dateInput = document.createElement('input')
    dateInput.classList.add('modal-date-input')
    dateInput.type = 'time'
    content.appendChild(dateInput)
    
    const submitButtonWrapper = document.createElement('div')
    submitButtonWrapper.classList.add('modal-submit-wrapper')
    const submitButton = document.createElement('button')
    submitButton.classList.add('submit-button')
    submitButton.classList.add('modal-submit')
    addText(submitButton, 'Оформить')
    submitButton.addEventListener('click', (e) => {
        if (!dateInput.value) {
            return
        }
    
        const date = new Date()
        const [hours, minutes] = dateInput.value.split(':')
        const selectedTime = new Date()
        selectedTime.setHours(Number(hours))
        selectedTime.setMinutes(Number(minutes))
        
        const isBackInTime = selectedTime < date
        
        if (isBackInTime) {
            dateInput.classList.add('modal-date-input__error')
            setTimeout(() => {
                alert('Мы не умеем перемещаться во времени. Выберите время позже, чем текущее.')
            }, 0)
        } else {
            hideModal()
        }
    })
    
    submitButtonWrapper.appendChild(submitButton)
    
    content.appendChild(submitButtonWrapper)
}