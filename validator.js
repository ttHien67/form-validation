
function Validator(options) {

    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var selectorRules = {};


    function Validatate(inputElement, rule){
        var errorMessage;
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message');
        var rules = selectorRules[rule.selector];

        for(var i=0; i<rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerHTML = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        }else {
            errorElement.innerHTML = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return errorMessage;
    }
    var formElement = document.querySelector(options.form);

    

    if(formElement){

        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = Validatate(inputElement, rule);
                if(isValid){
                    isFormValid = false;
                }
            })

            if(isFormValid){
                if(typeof options.onSubmit === 'function'){

                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    var formValue = Array.from(enableInputs).reduce(function (values, input){
                        values[input.name] = input.value;
                        return values; 
                    }, {})
                    options.onSubmit(formValue)
                }
            }

        }

        // L???p qua c??c rule
        options.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector);

            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else {
                selectorRules[rule.selector] = [rule.test]
            }
    
            if(inputElement){
                // X??? l?? khi onblur ra kh???i input
                inputElement.onblur = function(){
                    Validatate(inputElement, rule)
                }

                // X??a th??ng b??o khi nh???p input
                inputElement.oninput = function(){
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message');
                    errorElement.innerHTML = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            }
        })
    }




}

Validator.isRequired = function(selector, massage){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : massage || 'Vui l??ng nh???p tr?????ng n??y'
        }
    }
}

Validator.isEmail = function(selector, massage){
    return {
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : massage || 'Vui l??ng nh???p email'
        }
    }
}

Validator.minLength = function(selector, min){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : `Vui l??ng nh???p t???i thi???u ${min} k?? t???`
        }
    }
}

Validator.isConfirmed = function(selector, isConfirmValue, massage) {
    return {
        selector: selector,
        test: function(value){
            return value === isConfirmValue() ? undefined : massage || 'Vui l??ng x??c nh???n l???i email'
        }
    }
}