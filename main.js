import './style.scss'
import { staffData, DEPARTMENTS, LOCATIONS } from './data.js'


const parser = new DOMParser()

// DOM
const contentRegionElement = document.querySelector('[data-region="results-list"]')
const resultsStatusElement = document.querySelector('[role="status"]')
const searchInputElement = document.querySelector('input[type="search"]')

// state
let currentSearchTerm = ''
let selectedDepartment = []
let selectedYear = null


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
 * @function buildRadioInputs
 * @param  {Array} data array of input options
 */
function buildRadioInputs(options) {
    options.forEach(option => {

    })
}


/**
 * @function filterData
 * @param  {Array} data
 * @return {Array}
 */
function filterData(data) {
    let filteredData = data

    if (currentSearchTerm.length > 0) {
        filteredData = filteredData.filter(staffMember => {
            return staffMember.name.toLowerCase().includes(currentSearchTerm.toLowerCase())
        })
    }

    if (selectedDepartment.length) {
        filteredData = filteredData.filter(staffMember => {
            return selectedDepartment.includes(staffMember.department)
        })
    }

    if (selectedYear) {
        filteredData = filteredData.filter(staffMember => {
            return staffMember.years === selectedYear
        })
    }

    return filteredData
}

populateData(staffData)

searchInputElement.addEventListener('input', debounce((event) => {
    currentSearchTerm = event.target.value

    const data = filterData(staffData)

    console.log(data)

    populateData(data)
}, 500))