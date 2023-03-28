import $ from 'jquery';

/**
 * Preloader module.
 * @module preloader
 */
const Preloader = (($) => {
    /**
     * Constants:
     * - row--margin--60 (using unique namespace);
     * - classes for elements and states;
     * - selectors for inner elements;
     * - default settings;
     */

    const NAME = 'preloader';
    const VERSION = '0.1';
    const DATA_KEY = 'preloader';
    const EVENT_KEY = `.${DATA_KEY}`;
    const JQUERY_NO_CONFLICT = $.fn[NAME];

    const Event = {
        HIDE       : `hide${EVENT_KEY}`,
        HIDDEN     : `hidden${EVENT_KEY}`,
        SHOW       : `show${EVENT_KEY}`,
        SHOWN      : `shown${EVENT_KEY}`,
        CLICK      : `click${EVENT_KEY}`,
        START      : `start-preloader${EVENT_KEY}`,
        STOP       : `stop-preloader${EVENT_KEY}`,
    }

    const ClassNames = {
        BACKDROP: 'has-preloader-backdrop',
    }

    const Selectors = {}

    const Defaults = {
        tpl: $('#preloader-tpl')
    }

    /**
     * Class Definition
     */

    class Preloader {
        /**
         * Creates a new instance of a Preloader.
         * @param {jQuery|HTMLElement} element - jQuery object to make into a module.
         * @param {Object} config - Overrides to the default module settings.
         */
        constructor(element, config) {

            // private
            this._isEnabled = true;

            // protected
            this.element = element;
            this.config = this._getConfig(config);

            this._checkConfig();

            this.template = this._prepareTemplate();
            this._setListeners();
        }


        // getters

        /**
         * Returns module version
         * @returns {string}
         * @static
         */
        static get VERSION() {
            return VERSION;
        }

        /**
         * Returns default module settings
         * @returns {Object}
         * @static
         */
        static get Defaults() {
            return Defaults;
        }

        /**
         * Returns default module name
         * @returns {Object}
         * @static
         */
        static get NAME() {
            return NAME;
        }

        /**
         * Returns default module data key
         * @returns {Object}
         * @static
         */
        static get DATA_KEY() {
            return DATA_KEY;
        }

        /**
         * Returns default module event
         * @returns {Object}
         * @static
         */
        static get Event() {
            return Event;
        }

        /**
         * Returns default module ClassNames
         * @returns {Object}
         * @static
         */
        static get ClassNames() {
            return ClassNames;
        }

        /**
         * Returns default module Selectors
         * @returns {Object}
         * @static
         */
        static get Selectors() {
            return Selectors;
        }

        /**
         * Returns default module event key
         * @returns {Object}
         * @static
         */
        static get EVENT_KEY() {
            return EVENT_KEY;
        }


        // public

        enable() {
            this._isEnabled = true;
        }

        disable() {
            this._isEnabled = false;
        }

        toggleEnabled() {
            this._isEnabled = !this._isEnabled;
        }

        doSome(event) {
            return true;
        }

        dispose() {
            $.removeData(this.element, this.constructor.DATA_KEY);

            $(this.element).off(this.constructor.EVENT_KEY);

            this._isEnabled = null;
            this.element = null;
            this.config  = null;
        }

        // private

        _checkConfig() {
            const required = ['tpl'];
            const self = this;

            $.each(required, function (i, item) {
                if (typeof self.config[item] === 'undefined') {
                    throw new Error(`Missing config item: "${item}"`);
                }
            });
        }

        _prepareTemplate() {
            const source = $(this.config.tpl).html();
            const template = source;

            return template;
        }

        start() {
            const $target = $(this.element);

            //console.log('start');
            //console.log($target);

            this._positionTarget($target);
            this._appendBackdrop($target);
            $target.append(this.template);

            $target.css('pointer-events','none');
        }
    
        startBtn() {
            const $target = $(this.element);
        
            //console.log('start');
            //console.log($target);
        
            this._positionTarget($target);
            this._appendBackdrop($target);
        
            $target.append(this.template);
        }

        stop() {
            const $target = $(this.element);

            //console.log('stop');

            const $preloader = $target.find('.preloader');

            $preloader.remove();

            this._resetPositionTarget($target);
            this._removeBackdrop($target);
            $target.css('pointer-events','');

        }

        _appendBackdrop($target) {
            $target.addClass(this.constructor.ClassNames.BACKDROP);
        }

        _removeBackdrop($target) {
            $target.removeClass(this.constructor.ClassNames.BACKDROP);
        }

        _positionTarget($target) {
            const curPos = getComputedStyle($target[0]).position;

            if(curPos !== 'relative' && curPos !== 'absolute')
                $target.css('position', 'relative');
        }

        _resetPositionTarget($target) {
            const curPos = getComputedStyle($target[0]).position;

            $target.css('position', '');
        }

        _setListeners() {
            const self = this;
            
            $(this.element).on(
                this.constructor.Event.CLICK,
                (event) => this.doSome(event)
            );

            $(document).on(this.constructor.Event.START, (e) => {
                const $target = $(e.delegateTarget);

                self._startPreloader($target);
            });

            $(document).on(this.constructor.Event.STOP, (e) => {
                const $target = $(e.delegateTarget);

                self._stopPreloader($target);
            });

            // $(this.element)
            //     .on(
            //         this.constructor.Event.MOUSEENTER,
            //         (event) => this._enter(event)
            //     )
            //     .on(
            //         this.constructor.Event.MOUSELEAVE,
            //         (event) => this._leave(event)
            //     )
            // }
        }

        _getConfig(config) {
            config = $.extend(
                {},
                this.constructor.Defaults,
                $(this.element).data(),
                config
            );

            return config;
        }

        // static

        static _jQueryInterface(method, config) {
            return this.each(function () {
                let data      = $(this).data(DATA_KEY);
                const _config = typeof config === 'object' && config;

                if (!data && /dispose|hide/.test(config)) {
                    return;
                }

                if (!data) {
                    data = new Preloader(this, _config);
                    //console.log(data);
                    $(this).data(DATA_KEY, data);
                }

                if (typeof data[method] === 'undefined') {
                    throw new Error(`No method named "${method}"`);
                }

                data[method]();
            });
        }
    }


    /**
     * jQuery Interface initialization
     */
    $.fn[NAME] = Preloader._jQueryInterface;
    $.fn[NAME].Constructor = Preloader;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Preloader._jQueryInterface;
    };

    return Preloader;

})(jQuery);

new Preloader();
