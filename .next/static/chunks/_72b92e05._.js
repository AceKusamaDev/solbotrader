(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_72b92e05._.js", {

"[project]/src/components/Header.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"); // Import useState, useEffect
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@solana/wallet-adapter-react/lib/esm/useWallet.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// Dynamically import WalletMultiButton to avoid SSR issues
const WalletMultiButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(async ()=>(await __turbopack_context__.r("[project]/node_modules/@solana/wallet-adapter-react-ui/lib/esm/index.js [app-client] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i)).WalletMultiButton, {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/@solana/wallet-adapter-react-ui/lib/esm/index.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = WalletMultiButton;
// Header component using Wallet Adapter context and UI components
const Header = ()=>{
    _s();
    const { connected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"])(); // Get state from adapter context
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // State to track client mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            // Set mounted state to true only on the client side after initial render
            setIsMounted(true);
        }
    }["Header.useEffect"], []);
    // Note: Balance fetching is removed for simplicity, 
    // it can be added back using the adapter's connection if needed.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "bg-gray-900 text-white p-4 flex justify-between items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-bold",
                        children: "SolBotX"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    !connected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: isMounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WalletMultiButton, {
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
_s(Header, "3eCUZJfzrPeQE0xPdeuObDUeEww=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"]
    ];
});
_c1 = Header;
const __TURBOPACK__default__export__ = Header;
var _c, _c1;
__turbopack_context__.k.register(_c, "WalletMultiButton");
__turbopack_context__.k.register(_c1, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/Header.tsx [app-client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/Header.tsx [app-client] (ecmascript)"));
}}),
"[project]/node_modules/@solana/wallet-adapter-react/lib/esm/useWallet.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "WalletContext": (()=>WalletContext),
    "useWallet": (()=>useWallet)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
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
const WalletContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(DEFAULT_CONTEXT);
function useWallet() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(WalletContext);
} //# sourceMappingURL=useWallet.js.map
}}),
}]);

//# sourceMappingURL=_72b92e05._.js.map