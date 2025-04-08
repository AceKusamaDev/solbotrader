module.exports = {

"[project]/src/components/Header.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"); // Import useState, useEffect
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@solana/wallet-adapter-react/lib/esm/useWallet.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
;
'use client';
;
;
;
;
// Dynamically import WalletMultiButton to avoid SSR issues
const WalletMultiButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>(await __turbopack_context__.r("[project]/node_modules/@solana/wallet-adapter-react-ui/lib/esm/index.js [app-ssr] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i)).WalletMultiButton, {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/@solana/wallet-adapter-react-ui/lib/esm/index.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
// Header component using Wallet Adapter context and UI components
const Header = ()=>{
    const { connected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWallet"])(); // Get state from adapter context
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false); // State to track client mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Set mounted state to true only on the client side after initial render
        setIsMounted(true);
    }, []);
    // Note: Balance fetching is removed for simplicity, 
    // it can be added back using the adapter's connection if needed.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "bg-gray-900 text-white p-4 flex justify-between items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-bold",
                        children: "SolBotX"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    !connected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-4 px-3 py-1 bg-yellow-600 text-white rounded-md text-sm",
                        children: "Connect Wallet to Start"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: isMounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WalletMultiButton, {
                    style: {
                        height: '40px',
                        fontSize: '14px'
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 41,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Header.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = Header;
}}),
"[project]/src/components/Header.tsx [app-ssr] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/Header.tsx [app-ssr] (ecmascript)"));
}}),
"[project]/node_modules/@solana/wallet-adapter-react/lib/esm/useWallet.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "WalletContext": (()=>WalletContext),
    "useWallet": (()=>useWallet)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const EMPTY_ARRAY = [];
const DEFAULT_CONTEXT = {
    autoConnect: false,
    connecting: false,
    connected: false,
    disconnecting: false,
    select () {
        logMissingProviderError('call', 'select');
    },
    connect () {
        return Promise.reject(logMissingProviderError('call', 'connect'));
    },
    disconnect () {
        return Promise.reject(logMissingProviderError('call', 'disconnect'));
    },
    sendTransaction () {
        return Promise.reject(logMissingProviderError('call', 'sendTransaction'));
    },
    signTransaction () {
        return Promise.reject(logMissingProviderError('call', 'signTransaction'));
    },
    signAllTransactions () {
        return Promise.reject(logMissingProviderError('call', 'signAllTransactions'));
    },
    signMessage () {
        return Promise.reject(logMissingProviderError('call', 'signMessage'));
    },
    signIn () {
        return Promise.reject(logMissingProviderError('call', 'signIn'));
    }
};
Object.defineProperty(DEFAULT_CONTEXT, 'wallets', {
    get () {
        logMissingProviderError('read', 'wallets');
        return EMPTY_ARRAY;
    }
});
Object.defineProperty(DEFAULT_CONTEXT, 'wallet', {
    get () {
        logMissingProviderError('read', 'wallet');
        return null;
    }
});
Object.defineProperty(DEFAULT_CONTEXT, 'publicKey', {
    get () {
        logMissingProviderError('read', 'publicKey');
        return null;
    }
});
function logMissingProviderError(action, property) {
    const error = new Error(`You have tried to ${action} "${property}" on a WalletContext without providing one. ` + 'Make sure to render a WalletProvider as an ancestor of the component that uses WalletContext.');
    console.error(error);
    return error;
}
const WalletContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(DEFAULT_CONTEXT);
function useWallet() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(WalletContext);
} //# sourceMappingURL=useWallet.js.map
}}),

};

//# sourceMappingURL=_36bc5eb2._.js.map