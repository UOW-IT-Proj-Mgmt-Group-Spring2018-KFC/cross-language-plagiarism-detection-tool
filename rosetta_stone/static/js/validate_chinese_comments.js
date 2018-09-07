/**
 * @author luckytianpeng@hotmail.com
 * @date 2016-03-15
 *

html:
    <form infoColor="#ff8027" id="form-id">
        <label id='email-info'></label>
        <input id='email' class="auto-validate" 
            allowBlank="false" blankText="input email, please" 
            maxLength="10" maxLengthText="不能超过10个字符" 
            minLength="6" minLengthText="最少6个字符"
            regex="/\w+[@]{1}\w+[.]\w+/" regexText="invalid email"/>

        <input id='password' type='password' />
        <label id='repassword-info'></label>
        <input id='repassword' type='password'
            confirmTo='password' vtypeText='两次输入的密码不一致' />
    </form>

jQuery:
    $.FormValidator.init('form-id');
    $.FormValidator.validate('form-id');
*/

$(function() {
    $.FormValidator = function() {
    }

    /**
     * 初始化：
     *      
     */
    $.FormValidator.init = function (formId) {
        var infoColor = $('#' + formId).attr('infoColor');      // 获取需要校验的 form
        $('#' + formId + ' .auto-validate').each(function() {   // 遍历所有需要校验的 input
            var info = $('#' + $(this).attr('id') + '-info');
            if (undefined != info) {
                info.css('color', infoColor);                   // 设置提示信息颜色
                info.html('');                                  // 清空提示信息
                info.hide();                                    // 将提示信息区域隐藏
            }
        });
    }; // $.FormValidator.init

    /**
     * 校验：
     *      
     */
    $.FormValidator.validate = function(formId) {
        $.FormValidator.init(formId);   // 首先清空，防止上次校验的残留信息迷惑用户

        var result = true;

        $('#' + formId + ' .auto-validate').each(function () {  // 遍历所有需要校验的 input
            var r = true

            var allowBlank = true;
            try {
                allowBlank = JSON.parse($(this).attr('allowBlank')); // 'true' -> true
            } catch (exception) {
                //
            } finally {
                //
            }

            if (false == allowBlank) {                          // 不允许空缺
                var v = $(this).val();
                $(this).val(v.trim());                          // 空白符，也视为空缺
                
                if (0 >= $(this).val().trim().length) {
                    r = false;

                    var info = $('#' + $(this).attr('id') + '-info');
                    if (undefined != info) {
                        info.html($(this).attr('blankText'));   // 填入提示信息
                        info.show();                            // 显示提示信息
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
                    if (maxLength < $(this).val().length) {            // 大于最大长度
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
                    if (minLength > $(this).val().length) {             // 小于最小长度
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
                    regex = eval($(this).attr('regex'));    // 字符串转化为正则表达式
                } catch (exception) {
                    console.log(exception);
                } finally {
                    //
                }

                if (undefined != regex) {
                    console.log($(this).val().trim().length);
                    if ((0 < $(this).val().trim().length) && (! regex.test($(this).val()))) {      // 正则表达式匹配失败
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
                        if ($(this).val() !== obj.val()) {          // 比较，不相等
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