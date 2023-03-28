$( document ).ready(function ($) {
    var sendingLead = false;
    let config = {
        landingId: "e6899bf8-7d52-4202-855a-29e54632f99d",
        serviceUrl: "https://bpmsoft.rdv-it.ru/0/ServiceModel/GeneratedObjectWebFormService.svc/SaveWebFormObjectData",
        // serviceUrl: "https://rdv-it.bpmonline.com/0/ServiceModel/GeneratedObjectWebFormService.svc/SaveWebFormObjectData", // Р±РѕР№
        // serviceUrl: "https://rdvcrm.rdv-it.ru/0/ServiceModel/GeneratedObjectWebFormService.svc/SaveWebFormObjectData",  // С‚РµСЃС‚
        redirectUrl: ""
    };


    if ($(".bg-wrap").hasClass("header-block-event")) {

        config.landingId = "a0fbc711-b36a-4b4e-b5ce-410369765c60"; // Р±РѕР№
        //  config.landingId = "687cfa30-5c1c-4894-b5df-022c7217ee73f"; // С‚РµСЃС‚
        //
    }

    // if($("body").hasClass("rdv-market")){
    config.landingId = "e6899bf8-7d52-4202-855a-29e54632f99d"; // Р±РѕР№
    // config.landingId = "687cfa30-5c1c-4894-b5df-022c7217ee73";  // С‚РµСЃС‚
    // }


    function createObjectSubscribe(config) {
        landing.createObjectFromLanding(config);
    }

    // ajaxComplete is not a function ????
    if ($(document).ajaxComplete) {
        $(document).ajaxComplete(function( event, xhr, settings ) {
            var configs = getLandingConfigs();
            if ( settings.url === configs.serviceUrl ) {
                var data = JSON.parse(settings.data);
                if ($(data.formElementSelector).length) {
                    $(data.formElementSelector).trigger('crm-request:success');
                }
            }
        });
    }

    let url = document.location.href;
    // РџРµСЂРµРЅРµСЃРµРЅ РІ footer -> РєРѕРјРїРѕРЅРµРЅС‚ "rdv:rdv.callback ['.default']
    $(".modal-form-2 form").on("submit", function () {
        // $("#modal-form-2 #form-2-btnSend").on("click", function () {
        if (!$(this).valid()) return false;
        var form = $(this);
        if (!form.hasClass("yes")) {
            form.addClass("yes");
            form.attr("data-val", form.find("#form_1_comment").val());
        }
        let commentary = form.data("val");
        form.find("#form_1_comment").val(commentary);

        let error = true;
        let field = [];

        $($("#modal-form-2").find(".required")).each(function () {
            if (!$(this).val()) {
                field.push('.required');
            }
        });

        if (field.length == 0) {
            error = false;
        }

        var form2 = $("#modal-form-2").serializeArray();
        configs = getLandingConfigs();
        config.landingId = configs.landingId;
        config.serviceUrl = configs.serviceUrl;
        var isTest = false;
        $($("#modal-form-2").find(".required")).each(function () {
            var fval = $(this).val().toLowerCase();
            if (fval.includes("test") || fval.includes("С‚РµСЃС‚") || fval.includes("rdv")) {
                config.landingId = configs.landingIdTest;
                config.serviceUrl = configs.serviceUrlTest;
                isTest = true;
            }
        });
        if (!error || !sendingLead) {
            form.find('[type="submit"]').addClass('load');
            form.find('[type="submit"]').attr('disabled','disabled');
            sendingLead = true;
            config.fields = {
                "Name": "#FIO",
                "MobilePhone": "#PHONE_662",
                "Company": "#COMPANY_663",
                "Commentary": "#form_1_comment",
                "RDVUtmSource": "#CRM_form_utm_source_n",
                "RDVUtmMedium": "#CRM_form_utm_medium_n",
                "RDVUtmCampaign": "#CRM_form_utm_campaign_n",
                "RDVUtmTerm": "#CRM_form_utm_term_n",
                "RDVUtmContent": "#CRM_form_utm_content_n",
                "RDVSiteUrl": "#page_url",
            }
            config.formElementSelector ="#modal-form-2";
            if (isTest) {
                console.log("С‚РµСЃС‚РѕРІС‹Рµ РїР°СЂР°РјРµС‚СЂС‹ РёРЅС‚РµРіСЂР°С†РёРё!!!");
                config.landingId = configs.landingIdTest;
                config.serviceUrl = configs.serviceUrlTest;
                createObjectSubscribe(config);
                sendToAnalytics('modal-form-2-sended');
            } else {
                config.landingId = configs.landingId;
                config.serviceUrl = configs.serviceUrl;
                createObjectSubscribe(config);
                sendToAnalytics('modal-form-2-sended');
            }
            // sendMsgToSlack(config, "#modal-form-2"); // РћС‚РїСЂР°РІРєР° РґР°РЅРЅС‹С… РІ Slack
        }
    })
    // })


    // РџРµСЂРµРЅРµСЃРµРЅ РІ footer -> РєРѕРјРїРѕРЅРµРЅС‚ "rdv:rdv.form ['.default']
    $(".modal-form-3 form").on("submit", function () {
        // $("#modal-form-3 #form-3-btnSend").on("click", function () {
        if (!$(this).valid()) return false;
        console.log("prepare send to CRM");
        var form = $(this);
        if (!form.hasClass("yes")) {
            form.addClass("yes");


            form.attr("data-val", form.find("#form_3_comment").val());
        }
        let commentary = form.data("val");
        var tarif = $(this).find('.element').text();
        console.log(tarif);
        form.find("#form_3_comment").val('РЈСЃР»СѓРіР°: ' + tarif + ' / ' + commentary);
        /*РїСЂРѕРІРµСЂРєР° РЅР° РїСѓСЃС‚РѕС‚Сѓ*/
        let error = true;
        let field = [];
        $($("#modal-form-3").find(".required")).each(function () {
            if (!$(this).val()) {
                field.push('.required');
            }
        });

        if (field.length == 0) {
            error = false;
        }
        var location = window.location.href
        var g = getCookie("_gid");
        var y = getCookie("_ym_uid");
        console.log(g);
        console.log(y);
        /*end*/
        var form3 = $("#modal-form-3").serializeArray();
        configs = getLandingConfigs();
        config.landingId = configs.landingId;
        config.serviceUrl = configs.serviceUrl;
        var isTest = false;
        $($("#modal-form-3").find(".required")).each(function () {
            var fval = $(this).val().toLowerCase();
            if (fval.includes("test") || fval.includes("С‚РµСЃС‚") || fval.includes("rdv")) {
                isTest = true;
            }
        });

        var promo = $("#PROMO").val();
        var tarif = $("#PROMO").parents("#modal-form-3").find('#market_tarif').val();
        $("#PROMO").parents("#modal-form-3").find('input[name="Commentary"]').val(tarif);

        if (!error || !sendingLead) {
            form.find('[type="submit"]').addClass('load');
            form.find('[type="submit"]').attr('disabled','disabled');
            sendingLead = true;
            config.fields = {
                "Company": "#COMPANY_633",
                "Name": "#NAME_634",
                "MobilePhone": "#PHONE_635",
                "Email": "#EMAIL_636",
                "Website": "#SITE_766",
                "Commentary": "#form_3_comment",
                "RDVPromocode": "#PROMO",
                "RDVUtmSource": "#CRM_form_utm_source_n",
                "RDVUtmMedium": "#CRM_form_utm_medium_n",
                "RDVUtmCampaign": "#CRM_form_utm_campaign_n",
                "RDVUtmTerm": "#CRM_form_utm_term_n",
                "RDVSiteUrl": "#page_url"
            }
            config.formElementSelector ="#modal-form-3";

            if (isTest) {
                console.log("С‚РµСЃС‚РѕРІС‹Рµ РїР°СЂР°РјРµС‚СЂС‹ РёРЅС‚РµРіСЂР°С†РёРё!!!");
                config.landingId = configs.landingIdTest;
                config.serviceUrl = configs.serviceUrlTest;
                console.log(config);
                createObjectSubscribe(config);
                sendToAnalytics('modal-form-3-sended');
            } else {
                console.log("Р‘РѕРµРІС‹Рµ РїР°СЂР°РјРµС‚СЂС‹ РёРЅС‚РµРіСЂР°С†РёРё!!!");
                config.landingId = configs.landingId;
                config.serviceUrl = configs.serviceUrl;
                console.log(config);
                createObjectSubscribe(config);
                sendToAnalytics('modal-form-3-sended');
            }
            // sendMsgToSlack(config, "#modal-form-3 - РЎРѕР·РґР°РЅРёРµ Р»РёРґР°"); // РћС‚РїСЂР°РІРєР° РґР°РЅРЅС‹С… РІ Slack
        }
    })
    // })
// })


    // РџРµСЂРµРЅРµСЃРµРЅ РІ footer -> РєРѕРјРїРѕРЅРµРЅС‚ "rdv:rdv.question ['.default']
    $(".modal-form-4 form").on("submit", function () {
        // $("#modal-form-4 #form-4-btnSend").on("click", function () {
        if (!$(this).valid()) return false;
        var form = $(this);
        if (!form.hasClass("yes")) {
            form.addClass("yes");
            form.attr("data-val", form.find("#aspro_priority_question_comment").val());
        }
        let commentary = form.data("val");
        let commentary_2 = form.find("#MESSAGE_181").val();
        form.find("#aspro_priority_question_comment").val(commentary + " / РєРѕРјРјРµРЅС‚Р°СЂРёР№: " + commentary_2);

        let error = true;
        let field = [];
        $($("#modal-form-4").find(".required")).each(function () {
            if (!$(this).val()) {
                field.push('.required');
            }
        });

        if (field.length == 0) {
            error = false;
        }

        var location = window.location.href
        var g = getCookie("_gid");
        var y = getCookie("_ym_uid");

        var form4 = $("#modal-form-4").serializeArray();
        configs = getLandingConfigs();
        config.landingId = configs.landingId;
        config.serviceUrl = configs.serviceUrl;
        var isTest = false;
        $($("#modal-form-4").find(".required")).each(function () {
            var fval = $(this).val().toLowerCase();
            if (fval.includes("test") || fval.includes("С‚РµСЃС‚") || fval.includes("rdv")) {
                config.landingId = configs.landingIdTest;
                config.serviceUrl = configs.serviceUrlTest;
                isTest = true;
            }
        });

        if (!error || !sendingLead) {
            form.find('[type="submit"]').addClass('load');
            form.find('[type="submit"]').attr('disabled','disabled');
            sendingLead = true;
            config.fields = {
                "Name": "#NAME_177",
                "MobilePhone": "#PHONE_178",
                "Email": "#EMAIL_179",
                "Commentary": "#aspro_priority_question_comment",
                "RDVSiteUrl": "#page_url"
            }
            config.formElementSelector = '#modal-form-4'
            if (isTest) {
                console.log("С‚РµСЃС‚РѕРІС‹Рµ РїР°СЂР°РјРµС‚СЂС‹ РёРЅС‚РµРіСЂР°С†РёРё!!!");
                config.landingId = configs.landingIdTest;
                config.serviceUrl = configs.serviceUrlTest;
                createObjectSubscribe(config);
                sendToAnalytics('modal-form-4-sended');
            } else {
                config.landingId = configs.landingId;
                config.serviceUrl = configs.serviceUrl;
                createObjectSubscribe(config);
                sendToAnalytics('modal-form-4-sended');
            }
            // sendMsgToSlack(config, "#modal-form-4"); // РћС‚РїСЂР°РІРєР° РґР°РЅРЅС‹С… РІ Slack
        }
    })
    // })


    //РЅРµ РёР·РІРµСЃС‚РЅР°СЏ С„РѕСЂРјР°
    $("form[name='form_4']").on("submit", function () {
        var form = $(this);
        if (!form.hasClass("yes")) {
            form.addClass("yes");
            form.attr("data-val", form.find("#form_4_comment").val());
        }
        let commentary = form.data("val");
        let commentary_2 = form.find("#COMMENT_628").val();
        form.find("#form_4_comment").val(commentary + " / РєРѕРјРјРµРЅС‚Р°СЂРёР№: " + commentary_2);

        let error = true;
        let field = [];
        $(form.find(".required")).each(function () {
            if (!$(this).val()) {
                field.push('.required');
            }
        });

        if (field.length == 0) {
            error = false;
        }

        if (!error || !sendingLead) {
            form.find('[type="submit"]').addClass('load');
            form.find('[type="submit"]').attr('disabled','disabled');
            sendingLead = true;
            config.fields = {
                "Name": "#NAME_625",
                "MobilePhone": "#PHONE_626",
                "Company": "#COMPANY_627",
                "Commentary": "#form_4_comment",
                "RDVUtmSource": "#CRM_form_utm_source_n",
                "RDVUtmMedium": "#CRM_form_utm_medium_n",
                "RDVUtmCampaign": "#CRM_form_utm_campaign_n",
                "RDVUtmTerm": "#CRM_form_utm_term_n",
            }
            config.formElementSelector = "form[name='form_4']";
            createObjectSubscribe(config);
            sendToAnalytics('modal-form-4-sended');
            sendMsgToSlack(config, "#modal-form-4"); // РћС‚РїСЂР°РІРєР° РґР°РЅРЅС‹С… РІ Slack
        }
    })

    //РЅРµ РёР·РІРµСЃС‚РЅР°СЏ С„РѕСЂРјР° РІСЂРѕРґРµ modal-form-4, РЅРѕ РЅРµ СЃРѕРІСЃРµРј
    $("form[name='form_5']").on("submit", function () {
        if (!$(this).valid()) return false;
        var form = $(this);
        if (!form.hasClass("yes")) {
            form.addClass("yes");
            form.attr("data-val", form.find("#form_5_comment").val());
        }
        let commentary = form.data("val");
        form.find("#form_5_comment").val(commentary);

        let error = true;
        let field = [];
        $(form.find(".required")).each(function () {
            if (!$(this).val()) {
                field.push('.required');
            }
        });

        if (field.length == 0) {
            error = false;
        }

        if (!error || !sendingLead) {
            form.find('[type="submit"]').addClass('load');
            form.find('[type="submit"]').attr('disabled','disabled');
            sendingLead = true;
            config.fields = {
                "Company": "#COMPANY_629",
                "Name": "#NAME_630",
                "MobilePhone": "#PHONE_631",
                "Email": "#EMAIL_632",
                "Commentary": "#form_5_comment",
                "RDVUtmSource": "#CRM_form_utm_source_n",
                "RDVUtmMedium": "#CRM_form_utm_medium_n",
                "RDVUtmCampaign": "#CRM_form_utm_campaign_n",
                "RDVUtmTerm": "#CRM_form_utm_term_n",
            }
            config.formElementSelector = "form[name='form_5']";
            createObjectSubscribe(config);
            sendMsgToSlack(config, "#modal-form-5"); // РћС‚РїСЂР°РІРєР° РґР°РЅРЅС‹С… РІ Slack
        }
    })

    if ($("form[name='form_6']").length > 0) {
        let form = $("form[name='form_6']");
        let event = $("h1").text();
        let time = $(".js-time").text();

        form.find("#EVENT_647").val(event);
        form.find("#TIME_648").val(time);
        var id_event = $("#id_events").val();
        form.find("#ev").val(id_event);


    }
    $("form[name='form_6']").on("submit", function () {

        // console.log("form 6 send!!!");
        // return false;
        var form = $(this);
        var dol_comapany = $("#COMPANY_646").val();
        var job_title = $("#ATR_DOLZ").val();

        let event = form.find("#EVENT_647").val();
        let time = form.find("#TIME_648").val();
        let email = form.find('#EMAIL_645').val();

        let id_event = $("#id_events").val();
        if (!form.hasClass("yes")) {
            form.addClass("yes");
            form.attr("data-val", form.find("#form_6_comment").val());
        }
        let commentary = form.data("val");
        let speakerQuest = form.find('#SPEAKER_649').val();
        form.find("#form_6_comment").val(speakerQuest);
        form.find("#dol").val(dol_comapany);
        form.find("#job").val(job_title);

        let error = true;
        let field = [];
        $(form.find(".required")).each(function () {
            if (!$(this).val()) {
                field.push('.required');
            }
        });

        if (field.length == 0) {
            error = false;
        }

        if (!error || !sendingLead) {
            form.find('[type="submit"]').addClass('load');
            form.find('[type="submit"]').attr('disabled','disabled');

            sendingLead = true;


            config.fields = {

                "Event": "#ev",
                // "Name": "#NAME_643",
                // "Email": "#EMAIL_645",
                // "Phone": "#PHONE_644",
                // "Account": "#COMPANY_646",
                // "JobTitle": "#ATR_DOLZ",
                "RDVName": "#NAME_643",
                "RDVPhone": "#PHONE_644",
                "RDVAccount": "#COMPANY_646",
                "RDVJobTitle": "#ATR_DOLZ",
                "RDVEmail": "#EMAIL_645",
                "Note": "#form_6_comment",
                "RDVUtmSource": "#CRM_form_utm_source",
                "RDVUtmMedium": "#CRM_form_utm_medium",
                "RDVUtmCampaign": "#CRM_form_utm_campaign",
                "RDVUtmTerm": "#CRM_form_utm_term",
                "RDVUtmContent": "#CRM_form_utm_content"

            }
            config.formElementSelector = "form[name='form_6']";
            var urlPath = window.location.pathname;
            var parts = urlPath.split("/");
            if (parts[1] == "events") {
                console.log("changing landiD to events");
                config.landingId = "a0fbc711-b36a-4b4e-b5ce-410369765c60"; // РІСЂРµРјРµРЅРЅС‹Р№ РєРѕСЃС‚С‹Р»СЊ РґР»СЏ СЂРµРіРёСЃС‚СЂР°С†РёРё РјРµСЂРѕРїСЂРёСЏС‚РёР№
            }


            createObjectSubscribe(config);
        }
        return false;
    })
    $("form[name='form_7']").on("submit", function () {
        var form = $(this);
        let services = form.find("#SERVICES_654").find("option:selected").text();
        let comment = form.find("#COMMENT_655").val();

        if (!form.hasClass("yes")) {
            form.addClass("yes");
            form.attr("data-val", form.find("#form_7_comment").val());
        }
        let commentary = form.data("val");
        form.find("#form_7_comment").val(commentary + " /  РЈСЃР»СѓРіР° - " + services + " / РљРѕРјРјРµРЅС‚Р°СЂРёР№ - " + comment);

        let error = true;
        let field = [];
        $(form.find(".required")).each(function () {
            if (!$(this).val()) {
                field.push('.required');
            }
        });

        if (field.length == 0) {
            error = false;
        }

        if (!error || !sendingLead) {
            form.find('[type="submit"]').addClass('load');
            form.find('[type="submit"]').attr('disabled','disabled');

            sendingLead = true;
            config.fields = {
                "Name": "#NAME_650",
                "MobilePhone": "#PHONE_651",
                "Email": "#EMAIL_652",
                "Company": "#COMPANY_653",
                "Commentary": "#form_7_comment",
                "RDVUtmSource": "#CRM_form_utm_source_n",
                "RDVUtmMedium": "#CRM_form_utm_medium_n",
                "RDVUtmCampaign": "#CRM_form_utm_campaign_n",
                "RDVUtmTerm": "#CRM_form_utm_term_n",
            }
            config.formElementSelector = "form[name='form_7']";
            createObjectSubscribe(config);
        }

    })


    let page = 2;
    $(".js-news-1").on("click", function (e) {
        e.preventDefault();
        let pages = $(".s-success-add").data("cuountpage");

        if (page <= pages) {
            $.ajax({
                url: "/ajax/home.news_1.php?AJAX=Y&PAGEN_1=" + page,
                type: "post",
                dataType: "html",
                data: {},
                success: function (data) {
                    $(".s-success-add").append(data);
                    page++;
                }
            })
        }
    })

    let page2 = 2;
    $(".js-news-2").on("click", function (e) {
        e.preventDefault();
        let pages2 = $(".s-news-add").data("cuountpage");

        if (page2 <= pages2) {
            $.ajax({
                url: "/ajax/home.news_2.php?AJAX=Y&PAGEN_1=" + page2,
                type: "post",
                dataType: "html",
                data: {},
                success: function (data) {
                    $(".s-news-add").append(data);
                    page2++;
                }
            })
        }
    })

    let page3 = 2;
    $(".js-news-3").on("click", function (e) {
        e.preventDefault();
        let pages3 = $(".s-news-add").data("cuountpage");

        if (page3 <= pages3) {
            $.ajax({
                url: "/ajax/event.news.php?AJAX=Y&PAGEN_1=" + page3,
                type: "post",
                dataType: "html",
                data: {},
                success: function (data) {
                    $(".s-news-add").append(data);
                    page3++;
                }
            })
        }
    })

    if ($(".s-news.scroll").length > 0) {
        $("body, html").animate({
            scrollTop: $(".s-news.scroll").offset().top
        }, 1000);
    }

    $(".scroll-l").on("click", function (e) {
        e.preventDefault();
        let el = $(this).data("el");
        $("body, html").animate({
            scrollTop: $(el).offset().top
        }, 1000);
    })

    function getLandingConfigs() {

        var land = getLandingId();
        var configs = {
            landingId: land,
            serviceUrl: "https://bpmsoft.rdv-it.ru/0/ServiceModel/GeneratedObjectWebFormService.svc/SaveWebFormObjectData", // Р±РѕР№, РёР·РјРµРЅРёР» РЁРµРёРЅ РђР»РµРєСЃРµР№
            // serviceUrl: "https://rdv-it.bpmonline.com/0/ServiceModel/GeneratedObjectWebFormService.svc/SaveWebFormObjectData",
            landingIdTest: "687cfa30-5c1c-4894-b5df-022c7217ee73", // С‚РµСЃС‚
            serviceUrlTest: "https://rdvcrm.rdv-it.ru/0/ServiceModel/GeneratedObjectWebFormService.svc/SaveWebFormObjectData",  // С‚РµСЃС‚
        }

        // if($(".bg-wrap").hasClass("header-block-event")){

        //     var configs = {
        //         landingId: "e6899bf8-7d52-4202-855a-29e54632f99d", // Р±РѕР№
        //         landingIdTest: "687cfa30-5c1c-4894-b5df-022c7217ee73",// С‚РµСЃС‚
        //         serviceUrl: "https://rdv-it.bpmonline.com/0/ServiceModel/GeneratedObjectWebFormService.svc/SaveWebFormObjectData",
        //         serviceUrlTest:"https://rdvcrm.rdv-it.ru/0/ServiceModel/GeneratedObjectWebFormService.svc/SaveWebFormObjectData"
        //     }

        // }

        // if($("body").hasClass("rdv-market")){
        //     var configs = {
        //         landingId: "e6899bf8-7d52-4202-855a-29e54632f99d", // Р±РѕР№
        //         landingIdTest: "687cfa30-5c1c-4894-b5df-022c7217ee73",// С‚РµСЃС‚
        //         serviceUrl: "https://rdv-it.bpmonline.com/0/ServiceModel/GeneratedObjectWebFormService.svc/SaveWebFormObjectData",
        //         serviceUrlTest:"https://rdvcrm.rdv-it.ru/0/ServiceModel/GeneratedObjectWebFormService.svc/SaveWebFormObjectData"
        //     }
        // }

        return configs;
    }

    function getLandingId() {
        var landId = $("#CRM_LANDING_ID").val();
        if (landId) {
            return landId;
        }
        return "e6899bf8-7d52-4202-855a-29e54632f99d";
    }

    function getCookie(name) {
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
})

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
/* РџРѕРґСЃРєР°Р·РєРё */
// var suggest_count = 0;
// var input_initial_value = '';
// var suggest_selected = 0;

// // С‡РёС‚Р°РµРј РІРІРѕРґ СЃ РєР»Р°РІРёР°С‚СѓСЂС‹
// $("input[type=email]").keyup(function(I){
//     var that = $(this);
//     // РѕРїСЂРµРґРµР»СЏРµРј РєР°РєРёРµ РґРµР№СЃС‚РІРёСЏ РЅСѓР¶РЅРѕ РґРµР»Р°С‚СЊ РїСЂРё РЅР°Р¶Р°С‚РёРё РЅР° РєР»Р°РІРёР°С‚СѓСЂСѓ
//     switch(I.keyCode) {
//         // РёРіРЅРѕСЂРёСЂСѓРµРј РЅР°Р¶Р°С‚РёСЏ РЅР° СЌС‚Рё РєР»Р°РІРёС€С‹
//         case 13:  // enter
//         case 27:  // escape
//         case 38:  // СЃС‚СЂРµР»РєР° РІРІРµСЂС…
//         case 40:  // СЃС‚СЂРµР»РєР° РІРЅРёР·
//             break;

//         default:
//             // РїСЂРѕРёР·РІРѕРґРёРј РїРѕРёСЃРє С‚РѕР»СЊРєРѕ РїСЂРё РІРІРѕРґРµ РѕС‚ 1 СЃРёРјРІРѕР»Р° РїРѕСЃР»Рµ @
//             var search_str = $(this).val();
//             search_arr = search_str.split('@');
//             search_str = search_arr[1];
//             var list = [];
//             suggest_count = 0;

//             if( search_str.length > 0  ){

//                 input_initial_value = search_str;
//                 // РїСЂРѕРёР·РІРѕРґРёРј AJAX Р·Р°РїСЂРѕСЃ Рє /ajax/ajax.php, РїРµСЂРµРґР°РµРј РµРјСѓ GET query, РІ РєРѕС‚РѕСЂС‹Р№ РјС‹ РїРѕРјРµС‰Р°РµРј РЅР°С€ Р·Р°РїСЂРѕСЃ
//                 $.get("/local/ajax/email_hint.php", { "q":search_str },function(data){
//                     $(that).parents('.input').removeClass('tooltip_show');
//                     $('#search_advice_wrapper').remove();

//                     //php СЃРєСЂРёРїС‚ РІРѕР·РІСЂР°С‰Р°РµС‚ РЅР°Рј СЃС‚СЂРѕРєСѓ, РµРµ РЅР°РґРѕ СЂР°СЃРїР°СЂСЃРёС‚СЊ РІ РјР°СЃСЃРёРІ.
//                     // РІРѕР·РІСЂР°С‰Р°РµРјС‹Рµ РґР°РЅРЅС‹Рµ: ['test','test 1','test 2','test 3']
//                     if (data) {
//                         list = JSON.parse(data);
//                         if (list) {
//                             suggest_count = list.length;

//                         } else {
//                             $(that).parents('.input').removeClass('tooltip_show');
//                             $('#search_advice_wrapper').removeClass('has-list');
//                         }
//                     }

//                     if(suggest_count > 0) {
//                         $(that).parents('.input').append('<div id="search_advice_wrapper"></div>');
//                         $(that).parents('.input').addClass('tooltip_show');
//                         $(that).parents('.form-wrap__input-wrap').addClass('tooltip_show_wrap');
//                         // РїРµСЂРµРґ РїРѕРєР°Р·РѕРј СЃР»РѕСЏ РїРѕРґСЃРєР°Р·РєРё, РµРіРѕ РѕР±РЅСѓР»СЏРµРј
//                         $("#search_advice_wrapper").html("").show();
//                         $('#search_advice_wrapper').addClass('has-list');

//                         for(var i in list){
//                             if(list[i] != ''){
//                                 // РґРѕР±Р°РІР»СЏРµРј СЃР»РѕСЋ РїРѕР·РёС†РёРё
//                                 $('#search_advice_wrapper').append('<div class="advice_variant"><span class="advice-variant_first">'+ search_arr[0] +'@</span>'+list[i]+'</div>');
//                             }
//                         }
//                     } else {
//                         $('#search_advice_wrapper').parents('.tooltip_show').removeClass('tooltip_show')
//                         $(that).parents('.form-wrap__input-wrap').removeClass('tooltip_show_wrap');

//                         $('#search_advice_wrapper').removeClass('has-list');



//                     }
//                 }, 'html');
//             } else {
//                 $(that).parents('.input').removeClass('tooltip_show');
//                 $(that).parents('.form-wrap__input-wrap').removeClass('tooltip_show_wrap');

//                 $('#search_advice_wrapper').removeClass('has-list');
//                 $('#search_advice_wrapper').remove();

//             }
//             break;
//     }
// });

// //СЃС‡РёС‚С‹РІР°РµРј РЅР°Р¶Р°С‚РёРµ РєР»Р°РІРёС€СЊ, СѓР¶Рµ РїРѕСЃР»Рµ РІС‹РІРѕРґР° РїРѕРґСЃРєР°Р·РєРё
// $("input[type=email]").keydown(function(I){
//     switch(I.keyCode) {
//         // РїРѕ РЅР°Р¶Р°С‚РёСЋ РєР»Р°РІРёС€СЊ РїСЂСЏС‡РµРј РїРѕРґСЃРєР°Р·РєСѓ
//         case 13: // enter
//         case 27: // escape
//             $('#search_advice_wrapper').hide();
//             return false;
//             break;
//         // РґРµР»Р°РµРј РїРµСЂРµС…РѕРґ РїРѕ РїРѕРґСЃРєР°Р·РєРµ СЃС‚СЂРµР»РѕС‡РєР°РјРё РєР»Р°РІРёР°С‚СѓСЂС‹
//         case 38: // СЃС‚СЂРµР»РєР° РІРІРµСЂС…
//         case 40: // СЃС‚СЂРµР»РєР° РІРЅРёР·
//             I.preventDefault();
//             if(suggest_count){
//                 //РґРµР»Р°РµРј РІС‹РґРµР»РµРЅРёРµ РїСѓРЅРєС‚РѕРІ РІ СЃР»РѕРµ, РїРµСЂРµС…РѕРґ РїРѕ СЃС‚СЂРµР»РѕС‡РєР°Рј
//                 key_activate( I.keyCode-39 );
//             }
//             break;
//     }
// });

// // РґРµР»Р°РµРј РѕР±СЂР°Р±РѕС‚РєСѓ РєР»РёРєР° РїРѕ РїРѕРґСЃРєР°Р·РєРµ
// $('.form').on('click', '.advice_variant',function(){

//     $("input[type=email]").val($(this).text());
//     // РїСЂСЏС‡РµРј СЃР»РѕР№ РїРѕРґСЃРєР°Р·РєРё
//     $('#search_advice_wrapper').parents('.tooltip_show').removeClass('tooltip_show')
//     $('#search_advice_wrapper').parents('.form-wrap__input-wrap').removeClass('tooltip_show_wrap');

//     $('#search_advice_wrapper').remove();
// });

// // РµСЃР»Рё РєР»РёРєР°РµРј РІ Р»СЋР±РѕРј РјРµСЃС‚Рµ СЃР°Р№С‚Р°, РЅСѓР¶РЅРѕ СЃРїСЂСЏС‚Р°С‚СЊ РїРѕРґСЃРєР°Р·РєСѓ
// $('html').click(function(){
//     $('#search_advice_wrapper').parents('.tooltip_show').removeClass('tooltip_show')
//     $('#search_advice_wrapper').parents('.form-wrap__input-wrap').removeClass('tooltip_show_wrap');

//     $('#search_advice_wrapper').remove();

// });
// // РµСЃР»Рё РєР»РёРєР°РµРј РЅР° РїРѕР»Рµ input Рё РµСЃС‚СЊ РїСѓРЅРєС‚С‹ РїРѕРґСЃРєР°Р·РєРё, С‚Рѕ РїРѕРєР°Р·С‹РІР°РµРј СЃРєСЂС‹С‚С‹Р№ СЃР»РѕР№
// /* $('#search_box').click(function(event){
//      //alert(suggest_count);
//      if(suggest_count)
//          $('#search_advice_wrapper').show();
//      event.stopPropagation();
//  });
// */
// function key_activate(n){
//     $('#search_advice_wrapper div').eq(suggest_selected-1).removeClass('active');

//     if(n == 1 && suggest_selected < suggest_count){
//         suggest_selected++;
//     }else if(n == -1 && suggest_selected > 0){
//         suggest_selected--;
//     }

//     if( suggest_selected > 0){

//         $('#search_advice_wrapper div').eq(suggest_selected-1).addClass('active');
//         $("input[type=email]").val( search_arr[0]  + '@' + $('#search_advice_wrapper div').eq(suggest_selected-1).text() );
//     } else {

//         $("input[type=email]").val( search_arr[0]  + '@' + input_initial_value );
//     }
// }