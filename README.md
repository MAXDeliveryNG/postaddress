postaddress
=========

[![Greenkeeper badge](https://badges.greenkeeper.io/MAXDeliveryNG/postaddress.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/postaddress.png)](https://nodei.co/npm/postaddress/)

[![Build Status](https://travis-ci.org/chovy/postaddress.svg?branch=master)](https://travis-ci.org/chovy/postaddress) [![Requirements Status](https://requires.io/github/chovy/postaddress/requirements.png?branch=master)](https://requires.io/github/chovy/postaddress/requirements/?branch=master)

Parse a human name string into salutation, first name, middle name, last name, suffix.

## Install

	npm install postaddress

## Usage

	var human = require('postaddress');
	
### parse human name    

	var fullName = 'Mr. William R. Hearst, III';
		var attrs = human.parseName(fullName);

	console.log(attrs);

	//produces the following output
	
	{ 
		saluation: 'Mr.',
		firstName: 'William',
		suffix: 'III',
		lastName: 'Hearst',
		middleName: 'R.',
		fullName: 'Mr. William R. Hearst, III'
	}
	  
### get fullest name in string

	var name = 'John & Peggy Sue';
	var fullName = human.getFullestName(name);

	//produces the following output
	{
		fullName: 'Peggy Sue'
	}
	  
### parse address

	var address = '123 Happy Street, Honolulu, HI  65780';
	var parsed = human.parseAddress(address);
	
	//produces the following output    
	{
		address: '123 Happy Street',
		city: 'Honolulu',
		state: 'HI',
		zip: '65780',
		fullAddress: '123 Happy Street, Honolulu, HI  65780'
	}

