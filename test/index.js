//TODO: parseName
//John A. Doe, CAI, CES, CAGA
//John (Johnnie) Doe
//John "Johnnie" Doe

//TODO: getUsableName(str, idx)
//John Doe & Jim Duncan
//John Doe, Senior Whatever


var chai = require('chai');
var expect = chai.expect;
var parser = require('..');


// `describe` makes a "suite" of tests; think of them as a group.
describe('Parsing names', function() {

    var names = [
        {
            name: 'Mr. William R. Hearst, III',
            result: {
                salutation: 'Mr.',
                first_name: 'William',
                middle_name: 'R.',
                last_name: 'Hearst',
                suffix: 'III',
                full_name: 'Mr. William R. Hearst, III'
            }
        }, {
            name: 'William Randolph Hearst',
            result: {
                first_name: 'William',
                last_name: 'Hearst',
                middle_name: 'Randolph',
                full_name: 'William Randolph Hearst'
            }
        }, {
            name: 'William R. De La Cruz',
            result: {
                first_name: 'William',
                last_name: 'De La Cruz',
                middle_name: 'R.',
                full_name: 'William R. De La Cruz'
            }
        }, {
            name: 'Mr. William R. De La Cruz III',
            result: {
                salutation: 'Mr.',
                first_name: 'William',
                suffix: 'III',
                last_name: 'De La Cruz',
                middle_name: 'R.',
                full_name: 'Mr. William R. De La Cruz III'
            }
        }, {
            name: 'William De Cruz',
            result: {
                first_name: 'William',
                last_name: 'De Cruz',
                full_name: 'William De Cruz'
            }
        }, {
            name: 'William De La Cruz',
            result: {
                first_name: 'William',
                last_name: 'De La Cruz',
                full_name: 'William De La Cruz'
            }
        }, {
            name: 'Mr. William R. Hugh Calum De La Cruz III',
            result: {
                salutation: 'Mr.',
                first_name: 'William',
                suffix: 'III',
                last_name: 'De La Cruz',
                middle_name: 'R. Hugh Calum',
                full_name: 'Mr. William R. Hugh Calum De La Cruz III'
            }
		}, {
            name: 'William A. B. De La Cruz',
            result: {
                first_name: 'William',
                middle_name: 'A. B.',
                last_name: 'De La Cruz',
                full_name: 'William A. B. De La Cruz'
            }
		}, {
            name: 'James Hugh Calum Laurie',
            result: {
                first_name: 'James',
                middle_name: 'Hugh Calum',
                last_name: 'Laurie',
                full_name: 'James Hugh Calum Laurie'
            }
		}, {
            name: 'Kiefer William Frederick Dempsey George Rufus Sutherland',
            result: {
                first_name: 'Kiefer',
                middle_name: 'William Frederick Dempsey George Rufus',
                last_name: 'Sutherland',
                full_name: 'Kiefer William Frederick Dempsey George Rufus Sutherland'
            }
		}, {
            name: 'William Hearst',
            result: {
                first_name: 'William',
                last_name: 'Hearst',
                full_name: 'William Hearst'
            }
        }, {
            name: 'William Hearst Jr',
            result: {
                first_name: 'William',
                suffix: 'Jr',
                last_name: 'Hearst',
                full_name: 'William Hearst Jr'
            }
        }, {
            name: 'Hearst, William Jr',
            result: {
                first_name: 'William',
                suffix: 'Jr',
                last_name: 'Hearst',
                full_name: 'William Hearst Jr'
            }
        }, {
            name: 'Hearst, William Randolph',
            result: {
                first_name: 'William',
                last_name: 'Hearst',
                middle_name: 'Randolph',
                full_name: 'William Randolph Hearst'
            }
        }, {
            name: 'Hearst, William, M.D.',
            result: {
                first_name: 'William',
                suffix: 'M.D.',
                last_name: 'Hearst',
                full_name: 'William Hearst M.D.'
            }
        }, {
            name: 'William',
            result: {
                first_name: 'William',
                last_name: '',
                full_name: 'William'
            }
        }, {
            name: '',
            result: {
                first_name: '',
                last_name: '',
                full_name: ''
            }
        }
    ];

    var fullest = [
        {
            name: 'John & Peggy Sue',
            result: {
                full_name: 'Peggy Sue'
            }
        }, {
            name: 'John and Peggy Sue',
            result: {
                full_name: 'Peggy Sue'
            }
        }, {
            name: 'Jane and Mr. William R. De La Cruz III',
            result: {
                full_name: 'Mr. William R. De La Cruz III'
            }
        }
    ];

    var addresses = [
        {
            address: '123 W. Happy Day Blvd., San Francisco, CA  90501',
            result: {
                street: '123 W. Happy Day Blvd.',
                city: 'San Francisco',
                state: 'CA',
                zip: '90501',
                full_address: '123 W. Happy Day Blvd., San Francisco, CA  90501'
            }
        }, {
            address: '123 Happy Street, Honolulu, HI  Nigeria',
            result: {
                street: '123 Happy Street',
                city: 'Honolulu',
                state: 'HI',
                country: 'NG',
                full_address: '123 Happy Street, Honolulu, HI  Nigeria'
            }
        }, {
            address: '123 Happy Street, Suite #101, Honolulu, HI  65780',
            result: {
                street: '123 Happy Street, Suite #101',
                city: 'Honolulu',
                state: 'HI',
                zip: '65780',
                full_address: '123 Happy Street, Suite #101, Honolulu, HI  65780'
            }
        }
    ];

    it('Should parse all name attributes', function() {
        names.forEach(function(name, i, list) {
            var parsed = parser.name(name.name);

            expect(name.result).to.eql(parsed);
        });
    });

    it('Should parse fullest name', function() {
        fullest.forEach(function(name, i, list) {
            var full_ame = parser.get_fullest_name(name.name);

            expect(name.result.full_name).to.eql(full_ame);
        });
    });

    it('Should parse all address attributes', function() {
        addresses.forEach(function(address, i, list) {
            var parsed = parser.address(address.address);

            expect(address.result).to.eql(parsed);
        });
    });
});
