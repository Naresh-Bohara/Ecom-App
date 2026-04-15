const HttpResponse = {
    notFound: "NOT_FOUND",
    success: "Success_OK",
    unauthenticated:"UNAUTHENTICATED",
    internalServerError:"INTERNAL_SERVER_ERROR",
    validationFailed:"VALIDATION_FAILED",

    tokenExpired: "TOKEN_EXPIRED",

    user: {
        notActivate: "USER_NOT_ACTIVE",
        credentialNotMatch: "CREDENTIAL_NOT_MATCH" 
    },

    emptyRole: "ROLE_NOT_DEFINED",
    roleShouldBeArray: "ROLE_SHOULD_BE_ARRAY",
    accessDenied: "ACCESS_DENIED",

    banner: {
        create_success: "BANNER_CREATE_SUCCESS",
        update_error: "BANNER_CANNOT_UPDATE",
        update_success: "BANNER_UPDATE_SUCCESS",
        delete_error: "BANNER_CANNOT_DELETE",
        delete_success: "BANNER_DELETE_SUCCESS",
        list_for_home: "BANNER_LIST_FOR_HOME"
    },

    brand: {
        create_success: "BRAND_CREATE_SUCCESS",
        update_error: "BRAND_CANNOT_UPDATE",
        update_success: "BRAND_UPDATE_SUCCESS",
        delete_error: "BRAND_CANNOT_DELETE",
        delete_success: "BRAND_DELETE_SUCCESS",
        list_for_home: "BRAND_LIST_FOR_HOME"
    },
    category: {
        create_success: "CATEGORY_CREATE_SUCCESS",
        update_error: "CATEGORY_CANNOT_UPDATE",
        update_success: "CATEGORY_UPDATE_SUCCESS",
        delete_error: "CATEGORY_CANNOT_DELETE",
        delete_success: "CATEGORY_DELETE_SUCCESS",
        list_for_home: "CATEGORY_LIST_FOR_HOME"
    },
    product: {
        create_success: "PRODUCT_CREATE_SUCCESS",
        update_error: "PRODUCT_CANNOT_UPDATE",
        update_success: "PRODUCT_UPDATE_SUCCESS",
        delete_error: "PRODUCT_CANNOT_DELETE",
        delete_success: "PRODUCT_DELETE_SUCCESS",
        list_for_home: "PRODUCT_LIST_FOR_HOME",
        list_success: "PRODUCT_LIST_SUCCESS"
    },
        review: {
               create_success: "REVIEW_CREATE_SUCCESS",
        },
    cart: {
        create_cart_success: "CREATE_CART_SUCCESS",
        cart_update_success: "CART_UPDATE_SUCCESS",
        all_cart_list: "ALL_CART_LIST",
        cart_not_found: "CART_NOT_FOUND",
        remove_success: "CART_ITEM_REMOVED",
        order_placed: "ORDER_PLACED"
    }
}

export default HttpResponse;