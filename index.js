'use strict'

const _ = require('underscore')
const country = require('./country')

const parser = module.exports = {}

const capitalize = str => str.length ? str[0].toUpperCase() + str.substr(1).toLowerCase() : ''


parser.name = function(name) {

    let salutations = ['mr', 'master', 'mister', 'mrs', 'miss', 'ms', 'dr', 'prof', 'rev', 'fr', 'judge', 'honorable', 'hon', 'chief', 'hrh', 'igew', 'eze', 'oba', 'ogbeni', 'aare']
    let suffixes = ['i', 'ii', 'iii', 'iv', 'v', 'senior', 'junior', 'jr', 'sr', 'phd', 'apr', 'rph', 'pe', 'md', 'ma', 'dmd', 'cme']
    let compound = ['vere', 'von', 'van', 'de', 'del', 'della', 'der', 'di', 'da', 'pietro', 'vanden', 'du', 'st.', 'st', 'la', 'lo', 'ter', 'bin', 'ibn', 'te', 'ten', 'op', 'ben']

    let parts = name.trim().split(/\s+/)
    let attrs = {}

    if (!parts.length) {
        return attrs
    }

    if (parts.length === 1) {
        attrs.first_name = parts[0]
    }

    //handle suffix first always, remove trailing comma if there is one
    if (parts.length > 1 && _.indexOf(suffixes, _.last(parts).toLowerCase().replace(/\./g, '')) > -1) {
        attrs.suffix = parts.pop()
        parts[parts.length - 1] = _.last(parts).replace(',', '')
    }

    //look for a comma to know we have last name first format
    let first_name_first_format = _.every(parts, function(part) {
        return part.indexOf(',') === -1
    })

    if (!first_name_first_format) {
        //last name first format
        //assuming salutations are never used in this format

        //tracker letiable for where first name begins in parts array
        let first_name_index

        //location of first comma will separate last name from rest
        //join all parts leading to first comma as last name
        let last_name = _.reduce(parts, function(last_name, current, index) {
            if (!Array.isArray(last_name)) {
                return last_name
            }
            if (current.indexOf(',') === -1) {
                last_name.push(current)
                return last_name
            } else {
                current = current.replace(',', '')
                last_name.push(current)
                first_name_index = index + 1
                return last_name.join(' ')
            }
        }, [])

        attrs.last_name = last_name

        let remaining_parts = parts.slice(first_name_index)
        if (remaining_parts.length > 1) {
            attrs.first_name = remaining_parts.shift()
            attrs.middle_name = remaining_parts.join(' ')
        } else if (remaining_parts.length) {
            attrs.first_name = remaining_parts[0]
        }

        //create full name from attrs object
        let name_words = []
        if (attrs.first_name) {
            name_words.push(attrs.first_name)
        }
        if (attrs.middle_name) {
            name_words.push(attrs.middle_name)
        }
        name_words.push(attrs.last_name)
        if (attrs.suffix) {
            name_words.push(attrs.suffix)
        }
        attrs.full_name = name_words.join(' ')


    } else {
        //first name first format


        if (parts.length > 1 && _.indexOf(salutations, _.first(parts).toLowerCase().replace(/\./g, '')) > -1) {
            attrs.salutation = parts.shift()
            attrs.first_name = parts.shift()
        } else {
            attrs.first_name = parts.shift()
        }

        attrs.last_name = parts.length ? parts.pop() : ''

        // test for compound last name, we reverse because middle name is last bit to be defined.
        // We already know last_name, so check next word if its part of a compound last name.
        let rev_parts = parts.slice(0).reverse()
        let compound_parts = []

        _.every(rev_parts, function(part, i, all) {
            let test = part.toLowerCase().replace(/\./g, '')

            if (_.indexOf(compound, test) > -1) {
                compound_parts.push(part)

                return true
            }

            //break on first non compound word
            return false
        })

        //join compound parts with known last name
        if (compound_parts.length) {
            attrs.last_name = compound_parts.reverse().join(' ') + ' ' + attrs.last_name

            parts = _.difference(parts, compound_parts)
        }

        if (parts.length) {
            attrs.middle_name = parts.join(' ')
        }

        //remove comma like "<last_name>, Jr."
        if (attrs.last_name) {
            attrs.last_name = attrs.last_name.replace(',', '')
        }

        //save a copy of original
        attrs.full_name = name

    }
    //console.log('attrs:', JSON.stringify(attrs))
    return attrs
}

parser.get_fullest_name = function(str) {
    let name = str
    let names = []

    //find full_name from strings like 'Jon and Sue Doyle'
    if (name.indexOf('&') > -1 || name.toLowerCase().indexOf(' and ') > -1) {
        names = name.split(/\s+(?:and|&)\s+/gi)

        //pluck the name with the most parts (first, middle, last) from the array.
        //will grab 'Sue Doyle' in 'Jon & Sue Anne Doyle'
        if (names.length) {
            name = names.sort(function(a, b) {
                return b.split(/\s+/).length - a.split(/\s+/).length
            })[0]
        }
    }

    return name
}

parser.address = function(str) {
    //416 W. Manchester Blvd., Inglewood, CA  90301
    let parts = str.split(/,\s+/).reverse()

    let others
    let city
    let address = {}
    others = parts[0].split(/\s+/)
    parts.shift()

    city = parts.shift()

    address.street = parts.reverse().join(', ')
    address.city = city
    address.state = others[0]

    const last = others[1]

    if (Number.isSafeInteger(parseFloat(last))) {
        address.zip = last
    } else {
        address.country = last ? country[capitalize(last)] : ''
    }


    address.full_address = str

    return address
}
