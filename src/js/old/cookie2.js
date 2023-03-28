$( document ).ready(function() {
    // $('[data-form="modal-form-2"]').bind('click', function(){
    //     setTimeout(function(){
    //         $('#modal-form-2 [name="Commentary"]').val("Р—Р°РєР°Р· РѕР±СЂР°С‚РЅРѕРіРѕ Р·РІРѕРЅРєР° РёР· С€Р°РїРєРё СЃР°Р№С‚Р°");
    //     }, 500)
    // })

    $('.animated-labels input,.animated-labels textarea,.animated-labels select').each(function(){
        var value = $(this).val();

        if(value){
            $(this).closest(".animated-labels").addClass("input-filed");
        }
    });

    $(document).on("focus", ".animated-labels input,.animated-labels textarea,.animated-labels select", function(){
        $(this).closest(".animated-labels").addClass("input-filed");
    }).on("focusout", ".animated-labels input,.animated-labels textarea", function(){
        if("" != $(this).val())
            $(this).closest(".animated-labels").addClass("input-filed");
        else
            $(this).closest(".animated-labels").removeClass("input-filed");
    });

    var validator = $("form#modal-form-2").validate({
        // onsubmit: false,
        rules: {
            "FIO": {
                required: true,
            },
            "PHONE_662": {
                required: true,

            },
            "COMPANY_663": {
                required: true,
            },
            "licenses": {
                required: true
            }
        },
        messages: {
            "FIO": {
                required:  "",
            },
            "PHONE_662": {
                required:  "",
            },
            "COMPANY_663": {
                required:  "",
            },
            "licenses": {
                required: "Р—Р°РїРѕР»РЅРёС‚Рµ СЌС‚Рѕ РїРѕР»Рµ!"
            }
        },
        invalidHandler: function(event, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                console.log(errors);
            } else {
                console.log("no errors");
            }
        },
        errorPlacement: function(error, element) {
            console.log(element);
            console.log(error);
            console.log(element.htmlFor);
            var inputErrHolder = element.closest('.input');
            if(error){
                inputErrHolder.addClass('error');
            } else {
                inputErrHolder.removeClass('error');
            }
            if(element.htmlFor == "licenses") {

            }
        },
        submitHandler: function() {

        }

    });

    $("form#modal-form-2").on('crm-request:success', function() {
        var that_btn = $("#form-2-btnSend");
        $("#modal-form-2").attr("disabled", "disabled");
        $("#form-2-btnSend").attr("disabled", "disabled");
        var currentUrl = "/_dev/ajax_forms.php";
        var formFields = JSON.stringify($('#modal-form-2').serializeArray());
        var fd = new FormData;
        // getting cookies data
        var cookiesArr = {
            BpmRef: "bpmRef",
            BpmHref: "bpmHref",
            BpmSessionId: "bpmTrackingId",
            RDVGoogleAnalyticsId: "_gid",
            RDVYandexMetrikId: "_ym_uid",
        };
        for (var _arr = ["BpmRef", "BpmHref", "BpmSessionId", "RDVGoogleAnalyticsId", "RDVYandexMetrikId"], _i = 0; _i < _arr.length; _i++) {
            var cookie = _arr[_i];
            var realCookieName = cookiesArr[cookie];
            cookieVal = getCookie(realCookieName);
            cookiesArr[cookie] = cookieVal;
        }
        // getting utm values
        var utmArr = {
            RDVUtmSource: "#CRM_form_utm_source_n",
            RDVUtmMedium: "#CRM_form_utm_medium_n",
            RDVUtmCampaign: "#CRM_form_utm_campaign_n",
            RDVUtmTerm: "#CRM_form_utm_term_n",
            RDVSiteUrl: "#page_url"
        }
        for (var _arr = ["RDVUtmSource", "RDVUtmMedium", "RDVUtmCampaign", "RDVUtmTerm", "RDVSiteUrl"], _i = 0; _i < _arr.length; _i++) {
            var utm = _arr[_i];
            var realUtm = utmArr[utm];
            utmVal = $(realUtm).val();
            utmArr[utm] = utmVal;
        }
        //
        fd.append('submit', 'Y');
        fd.append('form','modal-form-2')
        fd.append('jsondata', formFields);
        fd.append('cookiesdata',  JSON.stringify(cookiesArr));
        fd.append('utmdata',  JSON.stringify(utmArr));
        console.log(formFields);
        //return 123;
        $.ajax({
            url: currentUrl,
            contentType: false,
            processData: false,
            data: fd,
            error: function(xhr, ajaxOptions, thrownError) {
                console.log("РџСЂРѕРёР·РѕС€Р»Р° РєР°РєР°СЏ-С‚Рѕ РѕС€РёР±РєР°");
                console.log(xhr);
                console.log(thrownError);
            },
            beforeSend: function(){
                that_btn.addClass('load');
                that_btn.attr('disabled','disabled');

            },
            success: function(response) {
                that_btn.removeClass('load');
                that_btn.removeAttr('disabled');
                var response = jQuery.parseJSON(response);
                if(response.status = "success"){
                    //console.log(response.message);
                    $(".form.inline.opened").hide();
                    $(".form.inline.success").show();
                } else if (response.status == "failure") {
                    //console.log(response.message);
                }
            },
            type: 'POST'
        });
        sendMsgToSlack(formFields, "#modal-form-2 - РЎРѕР·РґР°РЅРёРµ Р»РёРґР°"); // РћС‚РїСЂР°РІРєР° РґР°РЅРЅС‹С… РІ Slack
    })


    function getCookie (name) {
        var cname = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }
            if (c.indexOf(cname) === 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return null;
    }
    function isValidForm() {
        return $("#modal-form-2").valid();
    }

    function sendMsgToSlack(textMsg, formName) { // РћС‚РїСЂР°РІРєР° РґР°РЅРЅС‹С… РІ Slack

        var url = "https://hooks.slack.com/services/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";

        // var payload= {"text" : "РќРѕРІР°СЏ Р·Р°СЏРІРєР° СЃ СЃР°Р№С‚Р°"};
        var payload = {
            // "text" : JSON.stringify(textMsg)
            "text": "*РќРѕРІР°СЏ Р·Р°СЏРІРєР° СЃ СЃР°Р№С‚Р°*\nР¤РѕСЂРјР°: " + formName + "\n```" + textMsg + "```"
        };

        $.post(url, JSON.stringify(payload), function (data) {
            console.log('msg2slack gone');
            // console.log(data);
        });
    }

});