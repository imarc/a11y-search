import './style.scss'
import { STAFF_DATA, DEPARTMENTS, LOCATIONS, YEARS } from './data.js'
import { sift, select } from 'radash'

const parser = new DOMParser()

// DOM
const contentRegionElement = document.querySelector('[data-region="results-list"]')
const resultsStatusElement = document.querySelector('[role="status"]')
const searchInputElement = document.querySelector('input[type="search"]')
const departmentRegionElement = document.querySelector('[data-region="department-filters"]')
const locationRegionElement = document.querySelector('[data-region="location-filters"]')
const yearsInputElement = document.querySelector('select')
const clearFiltersElement = document.querySelector('[data-clear-filters]')

// state
let currentSearchTerm = ''
let selectedDepartment = null
let selectedLocation = null
let selectedYears = null


/**
 * @function debounce
 * @param  {Function} fn callback function
 * @param  {Number} delay
 */
function debounce(fn, delay) {
    let timeoutId
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay)
    }
}

/**
 * @function updateClearButton
 */
function updateClearButton() {
    !currentSearchTerm && !selectedDepartment && !selectedLocation && !selectedYears
        ? clearFiltersElement.setAttribute('disabled', 'true')
        : clearFiltersElement.removeAttribute('disabled')
}

/**
 * @function resetFilters
 */
function resetFilters() {
    currentSearchTerm = ''
    selectedDepartment = null
    selectedLocation = null
    selectedYears = null

    document.querySelectorAll('input[type="radio"], input[type="checkbox"]')
        .forEach(input => input.checked = false)
    searchInputElement.value = null
    yearsInputElement.selectedIndex = null

    updateClearButton()
    populateData(STAFF_DATA)
}

/**
 * @function updateState
 */
function updateState() {
    const departmentInputs = departmentRegionElement.querySelectorAll('input')
    const locationInputs = locationRegionElement.querySelectorAll('input')

    departmentInputs.forEach(input => {
        if (input.checked) {
            selectedDepartment = input.value
        }
    })

    locationInputs.forEach(input => {
        if (input.checked) {
            selectedLocation = input.value
        }
    })

    selectedYears = yearsInputElement.value === 'null' ? null : yearsInputElement.value
}


/**
 * @function updateStatus
 * @param  {Array} data
*/
function updateStatus(data) {
    if (data.length === 0) {
        resultsStatusElement.innerHTML = 'No results found.'

        return
    }

    const html = (strings, ...values)=> String.raw({ raw: strings }, ...values)
    // { select } [RADASH] allows you to `map` and `filter` in one function
    const selectedYearsLabel = select(YEARS, opt => opt.label, opt => opt.value == selectedYears )
    const newFilters = sift([selectedDepartment, selectedLocation, ...selectedYearsLabel])

    let output = `${data.length} results found`
    if (currentSearchTerm.length) {
        output += ` for "${currentSearchTerm}"`
    }
    if (newFilters.length ) {
        output += ` in`
        newFilters.forEach(term => {
            output += html`<span class="tag">${term}</span>`
        })
    }
    return resultsStatusElement.innerHTML = output
}

/**
 * @function parseTemplate
 * @param  {String} template
 * @return {HTMLElement}
 */
function parseTemplate(template) {
    return parser.parseFromString(template, 'text/html').body.firstChild
}

/**
 * @function populateData
 * @param  {Array} data array of staff objects
 */
function populateData(data) {
    contentRegionElement.innerHTML = ''

    data.forEach(staffMember => {
        const template = `
            <li class="content__resultItem resultItem">
                <article class="article">
                    <div class="article__content">
                        <h3 class="article__name">
                        <a href="#" class="article__link">
                            <span class="sr-only">Staff Bio for</span>
                            ${staffMember.name}
                        </a>
                        </h3>
                        <p>${staffMember.department}</p>
                        <p>${staffMember.years} years at Imarc</p>
                        <p>${staffMember.location}</p>
                    </div>
                    <div class="article__media">
                        <img class="article__image" src="${staffMember.avatar}" alt="Photo of ${staffMember.name}">
                    </div>
                </article>
            </li>
        `

        contentRegionElement.appendChild(parseTemplate(template))
    })

    updateStatus(data)
}

/**
 * @function populateInputs
 */
function populateInputs() {
    const formTemplate = ({ value, name, type }) => (`
        <label class="${type}" for="${value}">
            <input type="${type}" class="${type}__input" value="${value}" id="${value}" name="${name}" />
            <span>${value}</span>
        </label>
    `)

    LOCATIONS.forEach(value => {
        const element = parseTemplate(formTemplate({ value, name: 'location', type: 'radio' }))
        const input = element.querySelector('input')

        input.addEventListener('change', () => {
            const data = filterData(STAFF_DATA)
            populateData(data)
        })

        locationRegionElement.appendChild(element)
    })

    DEPARTMENTS.forEach(value => {
        const element = parseTemplate(formTemplate({ value, name: 'department', type: 'radio' }))
        const input = element.querySelector('input')

        input.addEventListener('change', () => {
            const data = filterData(STAFF_DATA)
            populateData(data)
        })

        departmentRegionElement.appendChild(element)
    })

    YEARS.forEach((option) => {
        const element = parseTemplate(`
            <option value="${option.value}" data-select="${option}">${option.label}</option>
        `)

        yearsInputElement.appendChild(element)
    })

    yearsInputElement.addEventListener('change', () => {
        const data = filterData(STAFF_DATA)
        populateData(data)
    })
}

/**
 * @function filterData
 * @param  {Array} data
 * @return {Array}
 */
function filterData(data) {
    let filteredData = data

    updateState()
    updateClearButton()

    if (currentSearchTerm.length) {
        filteredData = filteredData.filter(staffMember => {
            return staffMember.name.toLowerCase().includes(currentSearchTerm.toLowerCase())
        })
    }

    if (selectedDepartment) {
        filteredData = filteredData.filter(staffMember => staffMember.department === selectedDepartment)
    }

    if (selectedLocation) {
        filteredData = filteredData.filter(staffMember => staffMember.location === selectedLocation)
    }

    if (selectedYears) {
        const selectedYearsRange = select(YEARS, opt => opt.range, opt => opt.value == selectedYears)[0]

        filteredData = filteredData.filter(staffMember => selectedYearsRange.includes(staffMember.years))
    }

    return filteredData
}

populateInputs()
populateData(STAFF_DATA)

searchInputElement.addEventListener('input', debounce((event) => {
    currentSearchTerm = event.target.value
    const data = filterData(STAFF_DATA)
    populateData(data)
}, 500))

clearFiltersElement.addEventListener('click', resetFilters)