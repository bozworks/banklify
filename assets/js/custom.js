var mapNumber = function(number, in_min, in_max, out_min, out_max) {
	return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

var shadeColor = function(color, percent) {
    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
};

var getContrast = function (hexcolor){
	// If a leading # is provided, remove it
	if (hexcolor.slice(0, 1) === '#') {
		hexcolor = hexcolor.slice(1);
	}

	// If a three-character hexcode, make six-character
	if (hexcolor.length === 3) {
		hexcolor = hexcolor.split('').map(function (hex) {
			return hex + hex;
		}).join('');
	}

	// Convert to RGB value
	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);

	// Get YIQ ratio
	var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

	// Check contrast
	return (yiq >= 128) ? 'black' : 'white';
};

function imgs()
{
	function alreadyLoad(el)
	{
		return el.complete && el.naturalWidth !== 0;
	}

	var injects = document.querySelectorAll('img.inject');
	var imgs = document.querySelectorAll('img:not(.loaded)');

	for (var i = imgs.length - 1; i >= 0; i--) {
		if(alreadyLoad(imgs[i]))
		{
			imgs[i].classList.add('loaded');
			imgs[i].parentNode.classList.add('loaded');
		}
		else
		{
			imgs[i].addEventListener('load', function(){
				this.classList.add('loaded');
				this.parentNode.classList.add('loaded');
			});
		}
	}

	for (var i = injects.length - 1; i >= 0; i--) {
		if(injects[i].classList.contains('loaded'))
		{
			typeof SVGInject == "function" && injects[i].src.substring(injects[i].src.length - 3) == 'svg' && SVGInject(injects[i]);
		}
		else
		{
			injects[i].addEventListener('load', function(){
				typeof SVGInject == "function" && this.src.substring(this.src.length - 3) == 'svg' && SVGInject(this);
			});     
		}
	} 
}

function sizes()
{
	var size = document.getElementById('size');

	var moveSize = function()
	{
		var element,
		elements = document.querySelectorAll('.element');

		for (var i = elements.length - 1; i >= 0; i--) 
		{
			element = elements[i];

			element.style = "width:" + mapNumber(this.value, 0, 100, 50, 100) + "% !important";
		}
	};

	size && size.addEventListener('input', moveSize);

	moveSize.apply(size); 
}

function grounds()
{
	var ground = document.getElementById('groundcolor');

	var moveGround = function()
	{
		var element, percent,
		primaryElements = document.querySelectorAll('.ground-color-item'),
		bodyElements = document.querySelectorAll('.ground-color-body');

		for (var i = primaryElements.length - 1; i >= 0; i--) 
		{
			element = primaryElements[i];

			element.style = "background:" + this.value + " !important;color:" + getContrast(this.value) +" !important;";
		}

		for (var i = bodyElements.length - 1; i >= 0; i--) 
		{
			element = bodyElements[i];

			percent = getContrast(this.value) == "black" ? 40 : -40;

			element.style = "background:" + shadeColor(this.value, percent) + " !important;color:" + getContrast(shadeColor(this.value, percent)) +" !important;";
		}
	};

	ground && ground.addEventListener('input', moveGround);

	// moveGround.apply(ground); 
}

grounds();

window.addEventListener('load', function(){
	document.getElementById('bank-list-constructor').addEventListener('DOMSubtreeModified', function(){
		imgs();
	});
	imgs();
});

document.addEventListener('DOMContentLoaded', function(){

	document.getElementById('bank-list-constructor').addEventListener('DOMSubtreeModified', function(){
		sizes();
	});

	sizes();

  document.addEventListener('click', function(event){
    var target = event.target && event.target.closest('[data-download]');
    var element;
    if(target && target.querySelector('svg')) {
      element = document.createElement('a');
      element.href = target.querySelector('svg').getAttribute('data-inject-url') || (element.remove());
      if(element) {
        element.setAttribute('download', '');
        element.click();
        element.remove();
      }
    }
  });

	var options = {
		valueNames: [ 
		'data.self.name', 
		'data.type.name',
		{ name: 'data.logo.src', attr: 'src' },
		{ name: 'data.logo.title', attr: 'title' },
		{ name: 'data.type.i18n', attr: 'data-i18n' },
		{ name: 'data.verified.title', attr: 'title' },
		{ name: 'data.verified.i18n', attr: 'data-i18n' }
		],
		page: 30,
		pagination: [
		{
			outerWindow: 1,
			innerWindow: 4
		}
		]

	};

	var values = [
  // {
  //  'data.self.name': 'Banklify',
  //  'data.type.name': 'Special',
  //  'data.type.i18n': 'globals.special',
  //  'data.logo.src': 'logos/special/banklify.svg',
  //  'data.logo.title': 'Banklify Logo',
  //  'data.verified.title': 'Verified',
  //  'data.verified.i18n': '[title]globals.verified'
  // },
  {
  	'data.self.name': 'Akbank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/akbank.svg',
  	'data.logo.title': 'Akbank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Aktif Bank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/aktif-bank.svg',
  	'data.logo.title': 'Aktif Bank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Albaraka Türk',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/albaraka-turk-katilim-bankasi.svg',
  	'data.logo.title': 'Albaraka Türk Katılım Bankası Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Alipay',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/alipay.svg',
  	'data.logo.title': 'Alipay Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Alternatif Bank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/alternatif-bank.svg',
  	'data.logo.title': 'Alternatif Bank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'American Express',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/american-express.svg',
  	'data.logo.title': 'American Express Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Anadolubank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/anadolubank.svg',
  	'data.logo.title': 'Anadolubank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Bank of America',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/bank-of-america.svg',
  	'data.logo.title': 'Bank of America Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Belbim',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/belbim.svg',
  	'data.logo.title': 'Belbim Elektronik Para ve Ödeme Hizmetleri Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'BKM Express',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/bkm-express.svg',
  	'data.logo.title': 'BKM Express Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Boku',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/boku.svg',
  	'data.logo.title': 'Boku Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Burgan Bank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/burgan-bank.svg',
  	'data.logo.title': 'Burgan Bank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Capital One',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/capital-one.svg',
  	'data.logo.title': 'Capital One Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Chase',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/chase.svg',
  	'data.logo.title': 'J.P. Morgan Chase Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Citibank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/citibank.svg',
  	'data.logo.title': 'Citibank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Denizbank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/denizbank.svg',
  	'data.logo.title': 'Denizbank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Diners',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/diners.svg',
  	'data.logo.title': 'Diners Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Discover',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/discover.svg',
  	'data.logo.title': 'Discover Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'EBANX',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/ebanx.svg',
  	'data.logo.title': 'EBANX Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  // {
  //   'data.self.name': 'Fibabanka',
  //   'data.type.name': 'Bank',
  //   'data.type.i18n': 'globals.bank',
  //   'data.logo.src': 'logos/banks/fibabanka.svg',
  //   'data.logo.title': 'Fibabanka Logo',
  //   'data.verified.title': 'Not verified',
  //   'data.verified.i18n': '[title]globals.notVerified'
  // },
  {
  	'data.self.name': 'Garanti BBVA',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/garanti-bbva.svg',
  	'data.logo.title': 'Garanti BBVA Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Halkbank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/halkbank.svg',
  	'data.logo.title': 'Halkbank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'HSBC',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/hsbc.svg',
  	'data.logo.title': 'HSBC Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'ICBC',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/icbc.svg',
  	'data.logo.title': 'ICBC Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'ING',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/ing.svg',
  	'data.logo.title': 'ING Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'ininal',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/ininal.svg',
  	'data.logo.title': 'ininal Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'iPara',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/ipara.svg',
  	'data.logo.title': 'iPara Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'iyzico',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/iyzico.svg',
  	'data.logo.title': 'iyzico Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'JCB',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/jcb.svg',
  	'data.logo.title': 'JCB Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Kuveyt Türk',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/kuveyt-turk-katilim-bankasi.svg',
  	'data.logo.title': 'Kuveyt Türk Katılım Bankası Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Maestro',
  	'data.type.name': 'Card',
  	'data.type.i18n': 'globals.card',
  	'data.logo.src': 'logos/payment-systems/maestro.svg',
  	'data.logo.title': 'Maestro Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Mastercard',
  	'data.type.name': 'Card',
  	'data.type.i18n': 'globals.card',
  	'data.logo.src': 'logos/payment-systems/mastercard.svg',
  	'data.logo.title': 'Mastercard Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Odeabank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/odeabank.svg',
  	'data.logo.title': 'Odeabank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Ozan',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/ozan.svg',
  	'data.logo.title': 'Ozan Elektronik Para Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Papara',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/papara.svg',
  	'data.logo.title': 'Papara Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Param',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/param.svg',
  	'data.logo.title': 'Param Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Paycell',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/paycell.svg',
  	'data.logo.title': 'Paycell Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Payop',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/payop.svg',
  	'data.logo.title': 'Payop Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Paysend',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/paysend.svg',
  	'data.logo.title': 'Paysend Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'PayTR',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/paytr.svg',
  	'data.logo.title': 'PayTR Ödeme ve Elektronik Para',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'PTTBank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/pttbank.svg',
  	'data.logo.title': 'PTTBank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'QNB Finansbank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/qnb-finansbank.svg',
  	'data.logo.title': 'QNB Finansbank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Şekerbank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/sekerbank.svg',
  	'data.logo.title': 'Şekerbank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'T-Bank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/t-bank.svg',
  	'data.logo.title': 'Turkland Bank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Teb',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/teb.svg',
  	'data.logo.title': 'Türk Ekonomi Bankası Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'TCMB',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/turkiye-cumhuriyet-merkez-bankasi.svg',
  	'data.logo.title': 'Türkiye Cumhuriyet Merkez Bankası Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Troy',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/troy.svg',
  	'data.logo.title': 'Troy Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Tosla',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/tosla.svg',
  	'data.logo.title': 'Tosla Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Turkcell',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/turkcell-odeme-ve-elektronik-para.svg',
  	'data.logo.title': 'Turkcell Ödeme ve Elektronik Para Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'TURK Elektronik Para',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/turk-elektronik-para.svg',
  	'data.logo.title': 'TURK Elektronik Para Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Türkiye Finans',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/turkiye-finans-katilim-bankasi.svg',
  	'data.logo.title': 'Türkiye Finans Katılım Bankası Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Türkiye İş Bankası',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/turkiye-is-bankasi.svg',
  	'data.logo.title': 'Türkiye İş Bankası Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'UnionPay',
  	'data.type.name': 'Payment system',
  	'data.type.i18n': 'globals.paymentSystem',
  	'data.logo.src': 'logos/payment-systems/unionpay.svg',
  	'data.logo.title': 'UnionPay Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Vakıfbank',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/vakifbank.svg',
  	'data.logo.title': 'Vakıfbank Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Vakıf Katılım',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/vakif-katilim-bankasi.svg',
  	'data.logo.title': 'Vakıf Katılım Bankası Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Visa',
  	'data.type.name': 'Card',
  	'data.type.i18n': 'globals.card',
  	'data.logo.src': 'logos/cards/visa.svg',
  	'data.logo.title': 'Visa Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Yapı Kredi',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/yapi-kredi-bankasi.svg',
  	'data.logo.title': 'Yapı ve Kredi Bankası Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Ziraat Bankası',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/ziraat-bankasi.svg',
  	'data.logo.title': 'Ziraat Bankası Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  {
  	'data.self.name': 'Ziraat Katılım',
  	'data.type.name': 'Bank',
  	'data.type.i18n': 'globals.bank',
  	'data.logo.src': 'logos/banks/ziraat-katilim-bankasi.svg',
  	'data.logo.title': 'Ziraat Katılım Bankası Logo',
  	'data.verified.title': 'Not verified',
  	'data.verified.i18n': '[title]globals.notVerified'
  },
  ];

  var bankList = new List('bank-list-constructor', options, values);
});


var resources = {
	en: {
		translation: {
			globals: {
				special: "Special",
				bank: "Bank",
				paymentSystem: "Payment system",
				card: "Card",
				size: "Size",
				groundColor: "Ground color",
				informationText: "Information text",
				specifications: "Specifications",
				verified: "Verified",
				notVerified: "Not verified"
			},
			header: {
				h1: "Payment systems, bank and card logos",
				getStarted: "Get started",
				download: "Download all"
			},
			list: {
				sort: {
					name: "Sort by name",
					type: "Sort by type"
				},
				search: {
					placeholder: "Search for payment system, bank or card",
				}
			},
			aside: {
				title: "Customize",
				madeBy: "Made by @bozworks",
				termsMessage: 'This is a non-profit project. The validity of the logos is not guaranteed and may be removed without notice at the request of the relevant organizations. We recommend that you review the organizations\' policies before using logos.',
				organizationMessage: 'is licensed under the <a href="//github.com/bozworks/banklify/blob/master/LICENSE" class="font-weight-500" target="_blank">MIT License</a>.',
			},
			specifications: {
				verified: "Verified by the organization",
				notVerified: "Not verified by the organization",
			}
		}
	},
	tr: {
		translation: {
			globals: {
				special: "Özel",
				bank: "Banka",
				paymentSystem: "Ödeme sistemi",
				card: "Kart",
				size: "Boyut",
				groundColor: "Zemin rengi",
				informationText: "Bilgilendirme metni",
				specifications: "Özellikler",
				verified: "Doğrulandı",
				notVerified: "Doğrulanmadı"
			},
			header: {
				h1: "Ödeme sistemleri, banka ve kart logoları",
				getStarted: "Başlarken",
				download: "Tümünü indir"
			},
			list: {
				sort: {
					name: "İsme göre sırala",
					type: "Türe göre sırala"
				},
				search: {
					placeholder: "Ödeme sistemi, banka veya kart ara",
				}
			},
			aside: {
				title: "Özelleştir",
				madeBy: "@bozworks iştirakıdır",
				termsMessage: 'Bu kar amacı gütmeyen bir projedir. Logoların geçerliliği garanti edilmez ve ilgili kuruluşların talebi üzerine haber verilmeksizin kaldırılabilir. Logoları kullanmadan önce kuruluşların politikalarını incelemenizi öneririz.',
				organizationMessage: '<a href="//github.com/bozworks/banklify/blob/master/LICENSE" class="font-weight-500" target="_blank">MIT Lisansı</a> altında lisanslanmıştır.',
			},
			specifications: {
				verified: "Organizasyon tarafından doğrulandı",
				notVerified: "Organizasyon tarafından doğrulanmadı",
			}
		}
	},
};

function lookN$1(options) {
	var found = [];

	if (typeof navigator !== 'undefined') {
		if (navigator.languages) {
			for (var i = 0; i < navigator.languages.length; i++) {
				found.push(navigator.languages[i]);
			}
		}

		if (navigator.userLanguage) {
			found.push(navigator.userLanguage);
		}

		if (navigator.language) {
			found.push(navigator.language);
		}
	}

	return found.length > 0 ? found[0] : undefined;
}

document.addEventListener('DOMContentLoaded', function(){
	i18next.use(window.i18nextBrowserLanguageDetector).init({
    // debug: true,
    fallbackLng: ['en'],
    detection: {
    	order: ['localStorage', 'querystring', 'htmlTag', 'sessionStorage', 'cookie', 'path', 'navigator', 'subdomain'],
    },
    resources: resources
  }, function(err, t) {});

	var localize = locI18next.init(i18next, {
		selectorAttr: 'data-i18n',
		targetAttr: 'i18n-target',
		optionsAttr: 'i18n-options',
		useOptionsAttr: false,
		parseDefaultValueFromContent: true
	});

	function lookN()
	{
		var lu = lookN$1();
		var luel = document.querySelector('.language-message');

		if(luel)
		{
			luel.classList.remove('detected-tr', 'detected-en'); 
			luel.classList.add('d-none');

			if(sessionStorage.getItem('languageMessage') == 'dismiss') return;

			if(lu && lu.substr(0, 2) !== i18next.language.substr(0, 2) && ['en', 'tr'].indexOf(lu.substr(0, 2)) >= 0)
			{
				luel.classList.add('detected-'+lu.substr(0, 2));
				luel.classList.remove('d-none');
			}
		}
	}

	lookN();

	function stLng(lng)
	{
		lng = lng || i18next.language || 'en';
		lng = resources.hasOwnProperty(lng.substr(0, 2)) ? lng : 'en';
		document.documentElement.setAttribute('lang', lng);   
		localize("html");
	}

	stLng();

	document.getElementById('bank-list-constructor').addEventListener('DOMSubtreeModified', function(){
		stLng();
	});	

	function nxLng(lng)
	{
		lng = lng || document.documentElement.getAttribute('lang') || 'en';
		lng = lng.substr(0, 2);
		return lng == 'en' ? 'tr' : 'en';
	}

	i18next.on('languageChanged', function(lng) {
		stLng(lng);
		lookN();
	});

	var s = document.querySelector('.lng-switcher');

	s.addEventListener('click', function(e){
		e.preventDefault();
		localStorage.setItem('i18nextLng', nxLng());
		sessionStorage.setItem('languageMessage', 'dismiss');
		i18next.changeLanguage();
	});

	var g = document.querySelectorAll('[data-language-message]');

	for (var i = g.length - 1; i >= 0; i--) 
	{
		g[i].addEventListener('click', function(e){
			e.preventDefault();
			var attr = this.getAttribute('data-language-message');

			if(attr == 'dismiss')
			{
				sessionStorage.setItem('languageMessage', 'dismiss');
				lookN();
			}
			else
			{
				if(['en', 'tr'].indexOf(attr) < 0) return;
				localStorage.setItem('i18nextLng', attr);
				i18next.changeLanguage();
			}
		});
	}
});

