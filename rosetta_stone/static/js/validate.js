/**
 * @author luckytianpeng@gmail.com
 * @date 2018-08-30
 * @version: V1.2.0
 * @description:
 *      1) comments in English
 *
 * @author luckytianpeng@hotmail.com
 * @date 2016-03-15
 *

html:
    <form infoColor="#ff8027" id="form-id">
        <label id='email-info'></label>
        <input id='email' class="auto-validate" 
            allowBlank="false" blankText="input email, please" 
            maxLength="10" maxLengthText="no more chan 10 characters"
            minLength="6" minLengthText="at least 6 characters"
            regex="/\w+[@]{1}\w+[.]\w+/" regexText="invalid email"/>

        <input id='password' type='password' />
        <label id='repassword-info'></label>
        <input id='repassword' type='password'
            confirmTo='password' vtypeText='two passwords are unequalled' />
    </form>

jQuery:
    $.FormValidator.init('form-id');
    $.FormValidator.validate('form-id');
*/

$(function() {
    $.FormValidator = function() {
    }

    /**
     * init：
     *      
     */
    $.FormValidator.init = function (formId) {
        var infoColor = $('#' + formId).attr('data-infoColor');      // get all of forms which should be validated
        $('#' + formId + ' .auto-validate').each(function() {   // traversal all of inputs which should be validated
            var info = $('#' + $(this).attr('id') + '-info');
            if (undefined != info) {
                info.css('color', infoColor);                   // set the color of info
                info.html('');                                  // empty info
                info.hide();                                    // hide info
            }
        });
    }; // $.FormValidator.init

    /**
     * validate：
     *      
     */
    $.FormValidator.validate = function(formId) {
        $.FormValidator.init(formId);   // empty info

        var result = true;

        $('#' + formId + ' .auto-validate').each(function () {  // traversal inputs
            var r = true

            var allowBlank = true;
            try {
                allowBlank = JSON.parse($(this).attr('data-allowBlank')); // 'true' -> true
            } catch (exception) {
                //
            } finally {
                //
            }

            if (false == allowBlank) {                          // blank is not allowed
                var v = $(this).val();
                $(this).val(v.trim());                          // white character equals empty
                
                if (0 >= $(this).val().trim().length) {
                    r = false;

                    var info = $('#' + $(this).attr('id') + '-info');
                    if (undefined != info) {
                        info.html($(this).attr('data-blankText'));   // give info
                        info.show();                            // show info
                    }
                }
            }

            if (true == r) {
                var maxLength = undefined;
                try {
                    maxLength = JSON.parse($(this).attr('maxLength')); // '25' -> 25
                } catch (exception) {
                    //
                } finally {
                    //
                }

                if ("number" === $.type(maxLength)) {
                    if (maxLength < $(this).val().length) {            // longer than max length
                        r = false;

                        var info = $('#' + $(this).attr('id') + '-info');
                        if (undefined != info) {
                            info.html($(this).attr('maxLengthText'));
                            info.show();
                        }
                    }
                }
            }

            if (true == r) {
                var minLength = undefined;
                try {
                    minLength = JSON.parse($(this).attr('minLength'));
                } catch (exception) {
                    //
                } finally {
                    //
                }

                if ("number" === $.type(minLength)) {
                    if (minLength > $(this).val().length) {             // less than min length
                        r = false;
                        
                        var info = $('#' + $(this).attr('id') + '-info');
                        if (undefined != info) {
                            info.html($(this).attr('minLengthText'));
                            info.show();
                        }
                    }
                }
            }

            if (true == r) {
                var regex = undefined;
                try {
                    regex = eval($(this).attr('regex'));    // string to regular expression
                } catch (exception) {
                    console.log(exception);
                } finally {
                    //
                }

                if (undefined != regex) {
                    console.log($(this).val().trim().length);
                    if ((0 < $(this).val().trim().length) && (! regex.test($(this).val()))) {      // regular expression match failed
                        r = false;

                        var info = $('#' + $(this).attr('id') + '-info');
                        if (undefined != info) {
                            info.html($(this).attr('regexText'));
                            info.show();
                        }
                    }
                }
            }

            if (true == r) {
                var confirmTo = $(this).attr('confirmTo');
                if (undefined != confirmTo) {
                    var obj = $('#' + confirmTo);
                    if (undefined != obj && null != obj) {
                        if ($(this).val() !== obj.val()) {          // unequally
                            r = false;

                            var info = $('#' + $(this).attr('id') + '-info');
                            if (undefined != info) {
                                info.html($(this).attr('vtypeText'));
                                info.show();
                            }
                        }
                    }
                }
            }

            result = result && r;
        });

        return result;
    }; // $.FormValidator.validate
});