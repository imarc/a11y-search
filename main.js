import './style.scss'
import { staffData, DEPARTMENTS, LOCATIONS } from './data.js'


const parser = new DOMParser()

// DOM
const contentRegionElement = document.querySelector('[data-region="results-list"]')
const resultsStatusElement = document.querySelector('[role="status"]')
const searchInputElement = document.querySelector('input[type="search"]')
const departmentRegionElement = document.querySelector('[data-region="department-filters"]')
const locationRegionElement = document.querySelector('[data-region="location-filters"]')
const clearFiltersElement = document.querySelector('[data-clear-filters]')

// state
let currentSearchTerm = ''
let selectedDepartment = null
let selectedLocation = null


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
    !currentSearchTerm && !selectedDepartment && !selectedLocation
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

    document.querySelectorAll('input[type="radio"], input[type="checkbox"]')
        .forEach(input => input.checked = false)
    searchInputElement.value = null

    filterData(staffData)
    populateData(staffData)
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

    return resultsStatusElement.innerHTML = `${data.length} results found`
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
            const data = filterData(staffData)
            populateData(data)
        })

        locationRegionElement.appendChild(element)
    })

    DEPARTMENTS.forEach(value => {
        const element = parseTemplate(formTemplate({ value, name: 'department', type: 'radio' }))
        const input = element.querySelector('input')

        input.addEventListener('change', () => {
            const data = filterData(staffData)
            populateData(data)
        })

        departmentRegionElement.appendChild(element)
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
        console.log(selectedDepartment)
        filteredData = filteredData.filter(staffMember => staffMember.department === selectedDepartment)
    }

    if (selectedLocation) {
        filteredData = filteredData.filter(staffMember => staffMember.location === selectedLocation)
    }

    return filteredData
}

populateInputs()
populateData(staffData)

searchInputElement.addEventListener('input', debounce((event) => {
    currentSearchTerm = event.target.value
    const data = filterData(staffData)
    populateData(data)
}, 500))

clearFiltersElement.addEventListener('click', resetFilters)