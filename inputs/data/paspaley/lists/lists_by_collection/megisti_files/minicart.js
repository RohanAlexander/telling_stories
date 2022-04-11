/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'jquery',
    'ko',
    'underscore',
    'sidebar',
    'mage/translate'
], function (Component, customerData, $, ko, _) {
    'use strict';

    var sidebarInitialized = false,
        addToCartCalls = 0,
        miniCart;

    miniCart = $('[data-block=\'minicart\']');

    /**
     * @return {Boolean}
     */
    function initSidebar() {
        if (miniCart.data('mageSidebar')) {
            miniCart.sidebar('update');
        }

        if (!$('[data-role=product-item]').length) {
            return false;
        }
        miniCart.trigger('contentUpdated');

        if (sidebarInitialized) {
            return false;
        }
        sidebarInitialized = true;
        miniCart.sidebar({
            'targetElement': 'div.block.block-minicart',
            'url': {
                'checkout': window.checkout.checkoutUrl,
                'update': window.checkout.updateItemQtyUrl,
                'remove': window.checkout.removeItemUrl,
                'loginUrl': window.checkout.customerLoginUrl,
                'isRedirectRequired': window.checkout.isRedirectRequired
            },
            'button': {
                'checkout': '#top-cart-btn-checkout',
                'remove': '#mini-cart a.action.delete',
                'close': '#btn-minicart-close'
            },
            'showcart': {
                'parent': 'span.counter',
                'qty': 'span.counter-number',
                'label': 'span.counter-label'
            },
            'minicart': {
                'list': '#mini-cart',
                'content': '#minicart-content-wrapper',
                'qty': 'div.items-total',
                'subtotal': 'div.subtotal span.price',
                'maxItemsVisible': window.checkout.minicartMaxItemsVisible
            },
            'item': {
                'qty': ':input.cart-item-qty',
                'button': ':button.update-cart-item'
            },
            'confirmMessage': $.mage.__('Are you sure you would like to remove this item from the shopping cart?')
        });
    }

    miniCart.on('dropdowndialogopen', function () {
        initSidebar();
    });

    return Component.extend({
        shoppingCartUrl: window.checkout.shoppingCartUrl,
        maxItemsToDisplay: window.checkout.maxItemsToDisplay,
        cart: {},

        /**
         * @override
         */
        initialize: function () {
            var self = this,
                cartData = customerData.get('cart');

            this.update(cartData());
            cartData.subscribe(function (updatedCart) {
                addToCartCalls--;
                this.isLoading(addToCartCalls > 0);
                sidebarInitialized = false;
                this.update(updatedCart);
                initSidebar();
            }, this);
            $('[data-block="minicart"]').on('contentLoading', function () {
                addToCartCalls++;
                self.isLoading(true);
            });

            if (cartData()['website_id'] !== window.checkout.websiteId) {
                customerData.reload(['cart'], false);
            }

            return this._super();
        },
        isLoading: ko.observable(false),
        initSidebar: initSidebar,

        /**
         * Close mini shopping cart.
         */
        closeMinicart: function () {
            $('[data-block="minicart"]').find('[data-role="dropdownDialog"]').dropdownDialog('close');
        },

        /**
         * @return {Boolean}
         */
        closeSidebar: function () {
            var minicart = $('[data-block="minicart"]');

            minicart.on('click', '[data-action="close"]', function (event) {
                event.stopPropagation();
                minicart.find('[data-role="dropdownDialog"]').dropdownDialog('close');
            });

            return true;
        },

        /**
         * @param {String} productType
         * @return {*|String}
         */
        getItemRenderer: function (productType) {
            return this.itemRenderer[productType] || 'defaultRenderer';
        },

        /**
         * Update mini shopping cart content.
         *
         * @param {Object} updatedCart
         * @returns void
         */
        update: function (updatedCart) {
            _.each(updatedCart, function (value, key) {
                if (!this.cart.hasOwnProperty(key)) {
                    this.cart[key] = ko.observable();
                }
                this.cart[key](value);
            }, this);
        },

        /**
         * Get cart param by name.
         * @param {String} name
         * @returns {*}
         */
        getCartParam: function (name) {
            if (!_.isUndefined(name)) {
                if (!this.cart.hasOwnProperty(name)) {
                    this.cart[name] = ko.observable();
                }
            }
            //console.log(this.cart);
            return this.cart[name]();
        },

        /**
         * Returns array of cart items, limited by 'maxItemsToDisplay' setting
         * @returns []
         */
        getCartItems: function () {
            var items = this.getCartParam('items') || [];

            items = items.slice(parseInt(-this.maxItemsToDisplay, 10));

            for (var i = 0; i < items.length; i++) {
            	var options = items[i].options;
            	var item = items[i];

            	if(items[i].product_sku.indexOf('_') >= 0) {

            		var configSku = '';
            		var prodSku = item.product_sku.split('_');

	            	for (var t = 0; t < prodSku.length; t++) {
	            		var prodIndividual = prodSku[t];
	            		prodIndividual = prodIndividual.split(':');

	            		if(t == 0) {
	            			configSku += prodIndividual[0];
	            		} else {
	            			configSku += '_'+prodIndividual[0];
	            		}
	            	}

	            	item['custom_sku'] = configSku;
            	} else {
            		item['custom_sku'] = item.product_sku;
            	}

            	if(options != undefined && options != '' && options != null) {
                    //console.log(options);
            		for (var c = 0; c < options.length; c++) {
	            		var option = options[c];

	            		var custom_value = '';
                        if(option.value != false) {
                            if(option.value.indexOf(':') >= 0) {
                                var optionValue = option.value.split(':');

                                custom_value = optionValue[0];
                            } else {
                                custom_value = option.value;
                            }
                        }

	            		option.custom_value = custom_value;
	            	}
            	}

                var priceAmount = item['product_price'].replace(/<(?:.|\n)*?>/gm, '').trim();
                var priceArray = priceAmount.split('.');
                item['product_price'] = '<span class="price-including-tax" data-label="Incl. Tax"><span class="minicart-price"><span class="price">'+priceArray[0]+'</span>        </span></span>';

            }

            //console.log(items);


            return items;
        },

        /**
         * Returns count of cart line items
         * @returns {Number}
         */
        getCartLineItemsCount: function () {
            var items = this.getCartParam('items') || [];
            if(items.length == 1) {
            	$('.block-minicart').addClass('columns-2');
            	$('.block-minicart').removeClass('columns-4').removeClass('columns-3');
            } else if(items.length == 2) {
            	$('.block-minicart').addClass('columns-3');
            	$('.block-minicart').removeClass('columns-2').removeClass('columns-4');
            } else {
            	$('.block-minicart').addClass('columns-4');
            	$('.block-minicart').removeClass('columns-2').removeClass('columns-3');
            }
            return parseInt(items.length, 10);
        }
    });
});
