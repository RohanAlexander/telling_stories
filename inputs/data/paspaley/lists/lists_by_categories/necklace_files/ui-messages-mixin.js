/**
 * MageSpecialist
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to info@magespecialist.it so we can send you a copy immediately.
 *
 * @copyright  Copyright (c) 2017 Skeeller srl (http://www.magespecialist.it)
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

'use strict';

define(['MSP_ReCaptcha/js/registry'], function (registry) {

return function (originalComponent) {
    return originalComponent.extend({
        /**
         * Initialize reset on messages
         * @returns {initialize}
         */
        initialize: function () {
            this._super();

            this.messageContainer.errorMessages.subscribe(function () {
                var
                    i,
                    captchaList = registry.captchaList(),
                    tokenFieldsList = registry.tokenFields();

                for (i = 0; i < captchaList.length; i++) {
                    // eslint-disable-next-line no-undef
                    grecaptcha.reset(captchaList[i]);

                    if (tokenFieldsList[i]) {
                        tokenFieldsList[i].value = '';
                    }
                }
            }, null, 'arrayChange');

            return this;
        }
    });
};
});
