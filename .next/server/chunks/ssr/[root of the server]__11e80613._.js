module.exports = {

"[project]/src/lib/safetyFeatures.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "DEFAULT_STOP_LOSS_CONFIG": (()=>DEFAULT_STOP_LOSS_CONFIG),
    "DEFAULT_TAKE_PROFIT_CONFIG": (()=>DEFAULT_TAKE_PROFIT_CONFIG),
    "calculatePotentialLoss": (()=>calculatePotentialLoss),
    "calculatePotentialProfit": (()=>calculatePotentialProfit),
    "checkStopLoss": (()=>checkStopLoss),
    "checkTakeProfit": (()=>checkTakeProfit),
    "formatStopLossMessage": (()=>formatStopLossMessage),
    "formatTakeProfitMessage": (()=>formatTakeProfitMessage)
});
'use client';
const DEFAULT_STOP_LOSS_CONFIG = {
    enabled: true,
    percentage: 2.5
};
const DEFAULT_TAKE_PROFIT_CONFIG = {
    enabled: true,
    percentage: 5.0
};
const checkStopLoss = (position, currentPrice, stopLossConfig // Require config to be passed
)=>{
    if (!stopLossConfig.enabled || !currentPrice) {
        return false;
    }
    // For long positions (buy), trigger stop loss if price drops below threshold
    if (position.action === 'buy') {
        const stopLossThreshold = position.entryPrice * (1 - stopLossConfig.percentage / 100);
        return currentPrice <= stopLossThreshold;
    }
    // For short positions (sell), trigger stop loss if price rises above threshold
    if (position.action === 'sell') {
        const stopLossThreshold = position.entryPrice * (1 + stopLossConfig.percentage / 100);
        return currentPrice >= stopLossThreshold;
    }
    return false;
};
const checkTakeProfit = (position, currentPrice, takeProfitConfig // Require config to be passed
)=>{
    if (!takeProfitConfig.enabled || !currentPrice) {
        return false;
    }
    // For long positions (buy), trigger take profit if price rises above threshold
    if (position.action === 'buy') {
        const takeProfitThreshold = position.entryPrice * (1 + takeProfitConfig.percentage / 100);
        return currentPrice >= takeProfitThreshold;
    }
    // For short positions (sell), trigger take profit if price drops below threshold
    if (position.action === 'sell') {
        const takeProfitThreshold = position.entryPrice * (1 - takeProfitConfig.percentage / 100);
        return currentPrice <= takeProfitThreshold;
    }
    return false;
};
const formatStopLossMessage = (position, currentPrice, stopLossConfig // Require config
)=>{
    const direction = position.action === 'buy' ? 'dropped' : 'increased';
    const threshold = position.action === 'buy' ? position.entryPrice * (1 - stopLossConfig.percentage / 100) : position.entryPrice * (1 + stopLossConfig.percentage / 100);
    return `Stop loss triggered for ${position.pair}: Price ${direction} to ${currentPrice.toFixed(4)} (${stopLossConfig.percentage}% from entry ${position.entryPrice.toFixed(4)})`;
};
const formatTakeProfitMessage = (position, currentPrice, takeProfitConfig // Require config
)=>{
    const direction = position.action === 'buy' ? 'increased' : 'dropped';
    const threshold = position.action === 'buy' ? position.entryPrice * (1 + takeProfitConfig.percentage / 100) : position.entryPrice * (1 - takeProfitConfig.percentage / 100);
    return `Take profit triggered for ${position.pair}: Price ${direction} to ${currentPrice.toFixed(4)} (${takeProfitConfig.percentage}% from entry ${position.entryPrice.toFixed(4)})`;
};
const calculatePotentialLoss = (position, stopLossConfig)=>{
    const stopLossPrice = position.action === 'buy' ? position.entryPrice * (1 - stopLossConfig.percentage / 100) : position.entryPrice * (1 + stopLossConfig.percentage / 100);
    const loss = position.action === 'buy' ? (stopLossPrice - position.entryPrice) * position.amount : (position.entryPrice - stopLossPrice) * position.amount;
    return Math.abs(loss);
};
const calculatePotentialProfit = (position, takeProfitConfig)=>{
    const takeProfitPrice = position.action === 'buy' ? position.entryPrice * (1 + takeProfitConfig.percentage / 100) : position.entryPrice * (1 - takeProfitConfig.percentage / 100);
    const profit = position.action === 'buy' ? (takeProfitPrice - position.entryPrice) * position.amount : (position.entryPrice - takeProfitPrice) * position.amount;
    return profit; // Profit can be positive or negative if TP is set aggressively
};
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/node:crypto [external] (node:crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/punycode [external] (punycode, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/net [external] (net, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}}),
"[externals]/tls [external] (tls, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/node:url [external] (node:url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:url", () => require("node:url"));

module.exports = mod;
}}),
"[project]/src/lib/jupiter.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "SOL_MINT": (()=>SOL_MINT),
    "USDC_MINT": (()=>USDC_MINT),
    "default": (()=>__TURBOPACK__default__export__),
    "executeJupiterSwap": (()=>executeJupiterSwap),
    "getJupiterQuote": (()=>getJupiterQuote),
    "prepareJupiterSwapTransaction": (()=>prepareJupiterSwapTransaction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"); // Added useCallback
'use client';
;
;
// Constants for Jupiter API
const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap';
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const getJupiterQuote = async (params)=>{
    try {
        const { inputMint, outputMint, amount, slippageBps } = params;
        // Request dynamic compute unit price for priority fees
        const queryParams = new URLSearchParams({
            inputMint,
            outputMint,
            amount,
            slippageBps: slippageBps.toString(),
            computeUnitPriceMicroLamports: 'auto'
        });
        const response = await fetch(`${JUPITER_QUOTE_API}?${queryParams.toString()}`);
        if (!response.ok) {
            let errorBody = `Status: ${response.status} ${response.statusText}`;
            try {
                const jsonError = await response.json();
                errorBody = JSON.stringify(jsonError);
            } catch (e) {
            // Ignore if response body is not JSON
            }
            console.error('Jupiter quote API error response:', errorBody);
            throw new Error(`Jupiter quote API error: ${errorBody}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Jupiter quote:', error);
        throw error;
    }
};
const prepareJupiterSwapTransaction = async (params)=>{
    try {
        const { quoteResponse, userPublicKey } = params;
        const response = await fetch(JUPITER_SWAP_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey,
                // Pass dynamic priority fee info if available in quoteResponse
                computeUnitPriceMicroLamports: quoteResponse.computeUnitPriceMicroLamports ?? undefined
            })
        });
        if (!response.ok) {
            let errorBody = `Status: ${response.status} ${response.statusText}`;
            try {
                const jsonError = await response.json();
                errorBody = JSON.stringify(jsonError);
            } catch (e) {
            // Ignore if response body is not JSON
            }
            console.error('Jupiter swap API error response:', errorBody);
            throw new Error(`Jupiter swap API error: ${errorBody}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error preparing Jupiter swap transaction:', error);
        throw error;
    }
};
const executeJupiterSwap = async (swapResponseData, sendTransaction, connection)=>{
    try {
        let transaction;
        const base64Transaction = swapResponseData.swapTransaction; // Get the base64 string directly
        // Check if the base64 string exists
        if (base64Transaction && typeof base64Transaction === 'string') {
            // Deserialize the VersionedTransaction
            const serializedTransaction = Buffer.from(base64Transaction, 'base64');
            transaction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VersionedTransaction"].deserialize(serializedTransaction);
        } else {
            // Log the unexpected structure and throw error
            console.error('Unexpected swap response structure or missing swapTransaction field:', swapResponseData);
            throw new Error('Invalid transaction format received from Jupiter API');
        }
        // Send transaction using the provided function
        let signature;
        try {
            console.log('Attempting to send transaction via wallet adapter...'); // Log before sending
            // The wallet adapter's sendTransaction handles signing
            signature = await sendTransaction(transaction, connection);
            console.log('Transaction sent successfully, signature:', signature); // Log after successful send
        } catch (signError) {
            // Catch potential SendTransactionError for more details
            if (signError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SendTransactionError"]) {
                console.error('SendTransactionError:', signError.message);
                console.error('Logs:', signError.logs);
            }
            console.error('Full error object during signing/sending transaction:', signError); // Log the full error
            throw signError; // Re-throw the specific error
        }
        // Wait for confirmation with increased timeout and strategy
        let confirmation;
        try {
            console.log(`Waiting for confirmation for signature: ${signature}`);
            // Get the latest blockhash for confirmation strategy
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
            confirmation = await connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight
            }, 'confirmed'); // Pass commitment as the second argument
            // Check for confirmation error within the response value
            if (confirmation.value.err) {
                console.error('Transaction confirmation failed:', confirmation.value.err);
                throw new Error(`Transaction confirmation failed: ${JSON.stringify(confirmation.value.err)}`);
            }
            console.log('Transaction confirmed successfully:', confirmation);
        } catch (confirmError) {
            console.error(`Error confirming transaction ${signature}:`, confirmError); // Log the specific error here
            // Optionally, you might want to handle confirmation errors differently
            // For now, we'll re-throw
            throw confirmError;
        }
        return {
            signature,
            confirmation
        };
    } catch (error) {
        // Log the full error object for better debugging
        console.error('Full error object during Jupiter swap execution:', error);
        // Keep the original error throwing behavior
        throw error;
    }
};
// Hook exposing the trading function (no longer manages wallet state directly)
const useJupiterTrading = ()=>{
    // Execute trade with strategy - now requires wallet context
    // Use useCallback to memoize the function
    const executeTradeWithStrategy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (inputToken, outputToken, amount, slippage, strategy, // Required parameters from useWallet hook
    publicKey, sendTransaction, userPublicKeyString // Added userPublicKey as string
    )=>{
        // Check for publicKey (as PublicKey object) and userPublicKeyString (as string)
        if (!publicKey || !userPublicKeyString || !sendTransaction) {
            return {
                success: false,
                error: 'Wallet not connected or sendTransaction not available'
            };
        }
        try {
            // Create connection to Solana - Consider making RPC endpoint configurable via hook params or context
            const connection = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Connection"](("TURBOPACK compile-time value", "https://mainnet.helius-rpc.com/?api-key=07af9894-9c27-4a38-9a62-e538fa2786fe") || 'https://api.mainnet-beta.solana.com', 'confirmed');
            // Apply strategy parameters (this would be expanded based on strategy type)
            const slippageBps = slippage * 100; // Convert percentage to basis points
            // Get quote from Jupiter
            console.log(`Getting quote for ${amount} ${inputToken} to ${outputToken} with ${slippage}% slippage`);
            const quoteResponse = await getJupiterQuote({
                inputMint: inputToken,
                outputMint: outputToken,
                amount,
                slippageBps
            });
            console.log('Quote received:', quoteResponse);
            // Prepare swap transaction - use the passed userPublicKeyString
            console.log('Preparing swap transaction...');
            // Assert that userPublicKeyString is non-null here, as the initial check guarantees it.
            // This satisfies TypeScript's strict checking within the async function scope.
            if (!userPublicKeyString) {
                // This should theoretically never happen due to the check at the function start
                console.error("Critical Error: userPublicKeyString is null despite initial check.");
                throw new Error("User public key is unexpectedly null during swap preparation.");
            }
            const swapResponse = await prepareJupiterSwapTransaction({
                quoteResponse,
                userPublicKey: userPublicKeyString
            });
            console.log('Swap transaction prepared:', swapResponse);
            // Execute swap - pass sendTransaction function
            console.log('Executing swap...');
            const result = await executeJupiterSwap(swapResponse, sendTransaction, connection);
            console.log('Swap executed:', result);
            return {
                success: true,
                signature: result.signature,
                inputAmount: amount,
                expectedOutputAmount: quoteResponse.outAmount,
                strategy
            };
        } catch (error) {
            // Log the full error object for better debugging
            console.error('Full error object during trade execution:', error);
            return {
                success: false,
                // Provide more detail if available, otherwise keep original message
                error: error instanceof Error ? error.message : JSON.stringify(error)
            };
        }
    // Dependency array for useCallback is empty as it doesn't depend on props/state of this hook
    }, []);
    return {
        executeTradeWithStrategy
    };
};
const __TURBOPACK__default__export__ = useJupiterTrading;
}}),
"[project]/src/lib/marketData.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "fetchGeckoTerminalOhlcv": (()=>fetchGeckoTerminalOhlcv),
    "findPoolAddress": (()=>findPoolAddress)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$limiter$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/limiter/dist/esm/index.js [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$limiter$2f$dist$2f$esm$2f$RateLimiter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/limiter/dist/esm/RateLimiter.js [app-ssr] (ecmascript)");
;
// Define aggregate values based on timeframe
const TIMEFRAME_AGGREGATES = {
    day: 1,
    hour: [
        1,
        4,
        12
    ],
    minute: [
        1,
        5,
        15
    ]
};
// Rate limiter: 30 requests per minute (GeckoTerminal free tier limit)
const limiter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$limiter$2f$dist$2f$esm$2f$RateLimiter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RateLimiter"]({
    tokensPerInterval: 30,
    interval: 'minute'
});
// Base URL for GeckoTerminal API v2
const GECKO_TERMINAL_API_BASE = 'https://api.geckoterminal.com/api/v2';
// --- Caching ---
// Simple in-memory cache for pool addresses { pairString: poolAddress }
const poolAddressCache = new Map();
const CACHE_DURATION_MS = 60 * 60 * 1000; // Cache for 1 hour
const findPoolAddress = async (pairString, network = 'solana')=>{
    const cacheKey = `${network}:${pairString}`;
    const cached = poolAddressCache.get(cacheKey);
    if (cached) {
        console.log(`Cache hit for pool address: ${pairString}`);
        return cached;
    }
    console.log(`Searching for pool address for pair: ${pairString}`);
    // Wait for rate limiter token
    await limiter.removeTokens(1);
    const params = new URLSearchParams({
        query: pairString,
        network: network,
        include: 'base_token,quote_token',
        page: '1'
    });
    const url = `${GECKO_TERMINAL_API_BASE}/search/pools?${params.toString()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`GeckoTerminal Search API error: ${response.status} ${response.statusText}`);
            try {
                const errorData = await response.json();
                console.error('GeckoTerminal Search error details:', errorData);
            } catch (e) {}
            return null;
        }
        const results = await response.json();
        // Find the most relevant pool (e.g., first result, or filter by DEX/liquidity later)
        const pool = results?.data?.find((item)=>item.type === 'pool');
        if (pool && pool.attributes?.address) {
            const poolAddress = pool.attributes.address;
            console.log(`Found pool address for ${pairString}: ${poolAddress}`);
            // Cache the result
            poolAddressCache.set(cacheKey, poolAddress);
            // Set timeout to clear cache entry after duration
            setTimeout(()=>{
                poolAddressCache.delete(cacheKey);
                console.log(`Cache expired for pool address: ${pairString}`);
            }, CACHE_DURATION_MS);
            return poolAddress;
        } else {
            console.warn(`Pool address not found for pair: ${pairString}`);
            return null;
        }
    } catch (error) {
        console.error(`Error searching for pool address for ${pairString}:`, error.message);
        return null;
    }
};
const fetchGeckoTerminalOhlcv = async (poolAddress, timeframe, aggregate, limit = 100, beforeTimestamp)=>{
    // Validate aggregate based on timeframe
    if (timeframe === 'day' && aggregate !== 1 || timeframe === 'hour' && !TIMEFRAME_AGGREGATES.hour.includes(aggregate) || timeframe === 'minute' && !TIMEFRAME_AGGREGATES.minute.includes(aggregate)) {
        console.error(`Invalid aggregate value ${aggregate} for timeframe ${timeframe}`);
        return null;
    }
    // Wait for rate limiter token
    await limiter.removeTokens(1);
    const params = new URLSearchParams({
        aggregate: aggregate.toString(),
        limit: limit.toString(),
        currency: 'usd'
    });
    if (beforeTimestamp) {
        params.append('before_timestamp', beforeTimestamp.toString());
    }
    const network = 'solana'; // Hardcode network for this function
    const url = `${GECKO_TERMINAL_API_BASE}/networks/${network}/pools/${poolAddress}/ohlcv/${timeframe}?${params.toString()}`;
    // console.log(`Fetching GeckoTerminal OHLCV: ${url}`); // Reduce logging verbosity
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json;version=20240314' // Specify API version if needed
            }
        });
        if (!response.ok) {
            console.error(`GeckoTerminal API error: ${response.status} ${response.statusText}`);
            try {
                const errorData = await response.json();
                console.error('GeckoTerminal error details:', errorData);
            } catch (e) {}
            return null;
        }
        const data = await response.json();
        // Extract the OHLCV list - structure might vary, check API docs
        const ohlcvList = data?.data?.attributes?.ohlcv_list;
        if (!Array.isArray(ohlcvList)) {
            console.error('Unexpected API response structure:', data);
            return null;
        }
        // Format the data (assuming [timestamp, open, high, low, close, volume])
        const formattedData = ohlcvList.map((candle)=>({
                timestamp: candle[0],
                open: candle[1],
                high: candle[2],
                low: candle[3],
                close: candle[4],
                volume: candle[5]
            }));
        // Return in ascending order (oldest first) if needed by indicators
        return formattedData.reverse();
    } catch (error) {
        console.error('Error fetching GeckoTerminal OHLCV:', error.message);
        return null;
    }
}; // TODO: Implement caching mechanism (e.g., using localStorage or a simple in-memory cache)
 // TODO: Implement function to fetch data for multiple required timeframes respecting rate limits
 // Example: fetchMultiTimeframeData(poolAddress, ['14d', '7d_hourly', '24h_15min'])
}}),
"[project]/src/lib/marketAnalysis.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "assessMarketStructure": (()=>assessMarketStructure),
    "checkSmartRangeEntry": (()=>checkSmartRangeEntry),
    "checkSmartRangeExit": (()=>checkSmartRangeExit),
    "checkTrendTrackerEntry": (()=>checkTrendTrackerEntry),
    "checkTrendTrackerExit": (()=>checkTrendTrackerExit)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/marketData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$technicalindicators$2f$lib$2f$moving_averages$2f$EMA$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/technicalindicators/lib/moving_averages/EMA.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$technicalindicators$2f$lib$2f$oscillators$2f$RSI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/technicalindicators/lib/oscillators/RSI.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$technicalindicators$2f$lib$2f$moving_averages$2f$MACD$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/technicalindicators/lib/moving_averages/MACD.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$technicalindicators$2f$lib$2f$volatility$2f$BollingerBands$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/technicalindicators/lib/volatility/BollingerBands.js [app-ssr] (ecmascript)");
;
;
// --- Configuration ---
const DAILY_CANDLE_COUNT = 14;
const HOURLY_CANDLE_COUNT = 7 * 24; // 7 days
const FIFTEEN_MIN_CANDLE_COUNT = 24 * 4; // 24 hours
// Indicator Settings (Example - tune these)
const EMA_SHORT_PERIOD = 12;
const EMA_LONG_PERIOD = 26;
const RSI_PERIOD = 14;
const MACD_FAST_PERIOD = 12;
const MACD_SLOW_PERIOD = 26;
const MACD_SIGNAL_PERIOD = 9;
const BBANDS_PERIOD = 20;
const BBANDS_STDDEV = 2;
/**
 * Fetches multi-timeframe data for a given pool address.
 * Handles potential null responses from the fetch function.
 * TODO: Implement proper error handling and retries if needed.
 * TODO: Implement caching.
 */ const fetchAllTimeframes = async (poolAddress)=>{
    console.log(`Fetching all timeframes for pool: ${poolAddress}`);
    try {
        // Fetch data concurrently respecting rate limits (limiter is in fetch function)
        const [dailyData, hourlyData, fifteenMinData] = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchGeckoTerminalOhlcv"])(poolAddress, 'day', 1, DAILY_CANDLE_COUNT),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchGeckoTerminalOhlcv"])(poolAddress, 'hour', 1, HOURLY_CANDLE_COUNT),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchGeckoTerminalOhlcv"])(poolAddress, 'minute', 15, FIFTEEN_MIN_CANDLE_COUNT)
        ]);
        console.log(`Fetched Daily: ${dailyData?.length}, Hourly: ${hourlyData?.length}, 15-Min: ${fifteenMinData?.length}`);
        return {
            daily: dailyData,
            hourly: hourlyData,
            fifteenMin: fifteenMinData
        };
    } catch (error) {
        console.error("Error fetching multi-timeframe data:", error);
        return {
            daily: null,
            hourly: null,
            fifteenMin: null
        };
    }
};
/**
 * Calculates indicators based on OHLCV data.
 * Requires data to be sorted oldest to newest.
 */ const calculateIndicators = (data)=>{
    if (!data || data.length === 0) {
        return {}; // Return empty object if no data
    }
    const closePrices = data.map((d)=>d.close);
    // Keep other price arrays if needed for other indicators
    // const highPrices = data.map(d => d.high);
    // const lowPrices = data.map(d => d.low);
    // const openPrices = data.map(d => d.open);
    // const volume = data.map(d => d.volume);
    // Ensure enough data points for calculations
    const indicators = {
        emaShort: closePrices.length >= EMA_SHORT_PERIOD ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$technicalindicators$2f$lib$2f$moving_averages$2f$EMA$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMA"].calculate({
            period: EMA_SHORT_PERIOD,
            values: closePrices
        }) : [],
        emaLong: closePrices.length >= EMA_LONG_PERIOD ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$technicalindicators$2f$lib$2f$moving_averages$2f$EMA$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMA"].calculate({
            period: EMA_LONG_PERIOD,
            values: closePrices
        }) : [],
        rsi: closePrices.length >= RSI_PERIOD ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$technicalindicators$2f$lib$2f$oscillators$2f$RSI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RSI"].calculate({
            period: RSI_PERIOD,
            values: closePrices
        }) : [],
        macd: closePrices.length >= MACD_SLOW_PERIOD ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$technicalindicators$2f$lib$2f$moving_averages$2f$MACD$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MACD"].calculate({
            values: closePrices,
            fastPeriod: MACD_FAST_PERIOD,
            slowPeriod: MACD_SLOW_PERIOD,
            signalPeriod: MACD_SIGNAL_PERIOD,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        }) : [],
        bbands: closePrices.length >= BBANDS_PERIOD ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$technicalindicators$2f$lib$2f$volatility$2f$BollingerBands$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BollingerBands"].calculate({
            period: BBANDS_PERIOD,
            values: closePrices,
            stdDev: BBANDS_STDDEV
        }) : []
    };
    // Return the latest values
    return {
        latestEmaShort: indicators.emaShort[indicators.emaShort.length - 1],
        latestEmaLong: indicators.emaLong[indicators.emaLong.length - 1],
        latestRsi: indicators.rsi[indicators.rsi.length - 1],
        latestMacd: indicators.macd[indicators.macd.length - 1],
        latestBbands: indicators.bbands[indicators.bbands.length - 1]
    };
};
const assessMarketStructure = async (poolAddress)=>{
    const { daily, hourly, fifteenMin } = await fetchAllTimeframes(poolAddress);
    // --- Basic Checks ---
    if (!daily || !hourly || !fifteenMin || daily.length < DAILY_CANDLE_COUNT || hourly.length < 2 || fifteenMin.length < 2) {
        console.warn("Insufficient data for market analysis.");
        return {
            condition: 'Unclear'
        };
    }
    // --- Calculate Indicators ---
    const dailyIndicators = calculateIndicators(daily);
    const hourlyIndicators = calculateIndicators(hourly);
    const fifteenMinIndicators = calculateIndicators(fifteenMin);
    console.log("Daily Indicators:", dailyIndicators);
    console.log("Hourly Indicators:", hourlyIndicators);
    console.log("15-Min Indicators:", fifteenMinIndicators);
    // --- Market Condition Logic ---
    let determinedCondition = 'Unclear'; // Default to Unclear
    // --- Trend Analysis (Daily & Hourly) ---
    const dailyEmaShort = dailyIndicators.latestEmaShort;
    const dailyEmaLong = dailyIndicators.latestEmaLong;
    const hourlyRsi = hourlyIndicators.latestRsi;
    const isDailyTrendingUp = dailyEmaShort && dailyEmaLong && dailyEmaShort > dailyEmaLong;
    // --- Ranging Analysis (Hourly Bollinger Bands & RSI) ---
    const hourlyBbands = hourlyIndicators.latestBbands;
    let isHourlyRanging = false;
    if (hourlyBbands && hourlyRsi) {
        const bandWidth = (hourlyBbands.upper - hourlyBbands.lower) / hourlyBbands.middle;
        if (bandWidth < 0.1 && hourlyRsi > 40 && hourlyRsi < 60) {
            isHourlyRanging = true;
        }
    }
    // --- Determine Condition ---
    if (isDailyTrendingUp) {
        if (hourlyRsi && hourlyRsi > 50) {
            determinedCondition = 'Uptrend';
        } else {
            determinedCondition = 'Unclear'; // Weak confirmation
        }
    } else if (isHourlyRanging) {
        determinedCondition = 'Ranging';
    } else {
        determinedCondition = 'Unclear'; // Default if not clearly Uptrend or Ranging
    }
    console.log(`Determined Market Condition: ${determinedCondition}`);
    return {
        condition: determinedCondition,
        indicators: {
            dailyEMA: {
                short: dailyIndicators.latestEmaShort,
                long: dailyIndicators.latestEmaLong
            },
            hourlyRSI: hourlyIndicators.latestRsi,
            fifteenMinMACD: fifteenMinIndicators.latestMacd
        }
    };
};
const checkTrendTrackerEntry = (analysisResult, currentFifteenMinData)=>{
    if (analysisResult.condition !== 'Uptrend') return false;
    console.log("Checking TrendTracker Entry Conditions...");
    // --- Get Indicators ---
    const indicators = analysisResult.indicators;
    const fifteenMinIndicators = calculateIndicators(currentFifteenMinData); // Calculate 15min indicators
    if (!indicators || !indicators.dailyEMA || !indicators.hourlyRSI || !fifteenMinIndicators.latestMacd || !fifteenMinIndicators.latestRsi) {
        console.log("TrendTracker Reject: Missing required indicator data.");
        return false;
    }
    // 1. EMA Crossover Check (Daily) - Already confirmed by 'Uptrend' condition, but double-check
    const isDailyEMACrossedUp = indicators.dailyEMA.short && indicators.dailyEMA.long && indicators.dailyEMA.short > indicators.dailyEMA.long;
    if (!isDailyEMACrossedUp) {
        console.log("TrendTracker Reject: Daily EMA check failed.");
        return false;
    }
    // 2. RSI Check (Hourly & 15-min)
    // Hourly RSI > 50 (already checked in assessMarketStructure for Uptrend condition)
    // 15-min RSI > 50 (confirming short-term momentum)
    if (!indicators.hourlyRSI || indicators.hourlyRSI <= 50) {
        console.log(`TrendTracker Reject: Hourly RSI (${indicators.hourlyRSI}) not > 50.`);
        return false;
    }
    if (!fifteenMinIndicators.latestRsi || fifteenMinIndicators.latestRsi <= 50) {
        console.log(`TrendTracker Reject: 15min RSI (${fifteenMinIndicators.latestRsi}) not > 50.`);
        return false;
    }
    // 3. MACD Check (15-min) - MACD line > signal line
    const macdCheck = fifteenMinIndicators.latestMacd; // Use 15min MACD
    if (!macdCheck || !macdCheck.MACD || !macdCheck.signal || macdCheck.MACD <= macdCheck.signal) {
        console.log("TrendTracker Reject: 15min MACD line not above signal line.");
        return false;
    }
    // 4. Support/Resistance Break Check (Placeholder)
    // TODO: Implement S/R detection (e.g., using pivot points or recent highs/lows on daily/hourly)
    // TODO: Check if current price (e.g., currentFifteenMinData[currentFifteenMinData.length - 1].close) broke above a resistance level
    console.log("TrendTracker S/R Break Check: Placeholder - Not Implemented.");
    // 5. Volume Confirmation (Placeholder)
    // TODO: Implement volume analysis on breakout
    console.log("TrendTracker Volume Check: Placeholder - Not Implemented.");
    // If all implemented checks pass:
    console.log("TrendTracker Entry Conditions Met (Based on available checks).");
    return true;
};
const checkSmartRangeEntry = (analysisResult, currentFifteenMinData)=>{
    if (analysisResult.condition !== 'Ranging') return false;
    // TODO: Implement specific SmartRange Scout entry logic based on Task 1c/1e
    // - Optional oscillator confirmation (e.g., Stochastic) - TBD
    console.log("Checking SmartRange Scout Entry Conditions...");
    // --- Condition Checks ---
    // Calculate indicators specifically for the 15-min timeframe provided
    const fifteenMinIndicators = calculateIndicators(currentFifteenMinData);
    const currentPrice = currentFifteenMinData[currentFifteenMinData.length - 1]?.close;
    const bbands = fifteenMinIndicators.latestBbands; // Get latest BBands values { middle, upper, lower, pb }
    const rsi = fifteenMinIndicators.latestRsi; // Get latest RSI value
    if (!currentPrice || !bbands || !rsi) {
        console.log("SmartRange Reject: Insufficient 15min indicator data.");
        return false;
    }
    // 1. Bollinger Band Check: Price near or below lower band
    // Consider adding a small tolerance, e.g., price <= bbands.lower * 1.001
    const isNearLowerBand = currentPrice <= bbands.lower;
    if (!isNearLowerBand) {
        console.log(`SmartRange Reject: Price (${currentPrice.toFixed(4)}) not near lower BB (${bbands.lower.toFixed(4)}).`);
        return false;
    }
    // 2. RSI Check: RSI oversold
    const isRSIOversold = rsi < 35; // Use a configurable threshold?
    if (!isRSIOversold) {
        console.log(`SmartRange Reject: 15min RSI (${rsi.toFixed(2)}) not oversold (< 35).`);
        return false;
    }
    // 3. Support Level Confirmation (Placeholder)
    // TODO: Implement S/R detection based on daily/hourly data
    // TODO: Check if currentPrice is within a tolerance range of a detected support level
    console.log("SmartRange Support Check: Placeholder - Not Implemented.");
    // If all implemented checks pass:
    console.log("SmartRange Scout Entry Conditions Met (Based on available checks).");
    return true; // Allow entry if BB and RSI conditions met (pending S/R)
};
const checkTrendTrackerExit = (position, analysisResult, currentFifteenMinData)=>{
    if (analysisResult.condition === 'Ranging' || analysisResult.condition === 'Unclear') {
        console.log("TrendTracker Exit: Market condition changed from Uptrend.");
        return true; // Exit if market is no longer clearly trending up
    }
    // TODO: Implement specific TrendTracker exit logic
    // - Trailing Stop Loss?
    // - Price crosses below a key EMA (e.g., daily EMA long)?
    // - RSI drops below a certain level (e.g., 50 or 40)?
    // - MACD crossover downwards?
    console.log("Checking TrendTracker Exit Conditions (Placeholder)...");
    return false; // Placeholder - don't exit yet
};
const checkSmartRangeExit = (position, analysisResult, currentFifteenMinData)=>{
    if (analysisResult.condition === 'Uptrend' || analysisResult.condition === 'Unclear') {
        console.log("SmartRange Exit: Market condition changed from Ranging.");
        return true; // Exit if market is no longer clearly ranging
    }
    // TODO: Implement specific SmartRange Scout exit logic
    // - Price reaches range high or midpoint (needs range detection)?
    // - RSI becomes overbought (e.g., > 70)?
    // - Price breaks support (handled by SL)?
    console.log("Checking SmartRange Exit Conditions (Placeholder)...");
    return false; // Placeholder - don't exit yet
};
}}),
"[project]/src/components/BotControl.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@solana/wallet-adapter-react/lib/esm/useWallet.js [app-ssr] (ecmascript)");
// Import safety features (including TP types/functions now)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safetyFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/safetyFeatures.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/jupiter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useBotStore.ts [app-ssr] (ecmascript)"); // Import Zustand store and Trade type
// Import market data and analysis functions
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/marketData.ts [app-ssr] (ecmascript)"); // Import fetch function
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketAnalysis$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/marketAnalysis.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
// BotControl component refactored to use Zustand store
const BotControl = ()=>{
    // Local state for UI feedback or component-specific logic
    const [stopLossTriggeredUI, setStopLossTriggeredUI] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stopLossMessageUI, setStopLossMessageUI] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const tradingIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isProcessingTrade, setIsProcessingTrade] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false); // Local state for disabling buttons during trade
    const [currentPoolAddress, setCurrentPoolAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null); // Cache pool address
    const [analysisResult, setAnalysisResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null); // Store last analysis
    // --- Get state and actions from Zustand store ---
    // Only select actions needed for handlers, read state inside loopLogic via getState()
    const { status, settings, activePositions, tradeHistory, errorMessage, startBot: storeStartBot, stopBot: storeStopBot, toggleTestMode: storeToggleTestMode, addPosition, removePosition, addTradeHistory, setError, setRunning, setAnalyzing, setSettings, setMarketCondition } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])((state)=>({
            status: state.status,
            settings: state.settings,
            activePositions: state.activePositions,
            tradeHistory: state.tradeHistory,
            errorMessage: state.errorMessage,
            startBot: state.startBot,
            stopBot: state.stopBot,
            toggleTestMode: state.toggleTestMode,
            addPosition: state.addPosition,
            removePosition: state.removePosition,
            addTradeHistory: state.addTradeHistory,
            setError: state.setError,
            setRunning: state.setRunning,
            setAnalyzing: state.setAnalyzing,
            setSettings: state.setSettings,
            setMarketCondition: state.setMarketCondition
        }));
    // Destructure settings for easier access in JSX and handlers
    const { isTestMode, stopLossPercentage, takeProfitPercentage, maxRuns, runIntervalMinutes, compoundCapital, strategyType, amount, pair, action } = settings;
    // Get wallet context
    const { publicKey, connected: isWalletConnected, sendTransaction } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWallet"])();
    // Get Jupiter trading function
    const { executeTradeWithStrategy } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])();
    // --- Core Logic Functions ---
    // Fetch current price (using GeckoTerminal 1-min candle close)
    const fetchCurrentPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (fetchPair)=>{
        const poolAddress = currentPoolAddress ?? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findPoolAddress"])(fetchPair);
        if (!poolAddress) {
            console.error(`Cannot fetch price for ${fetchPair}, pool address unknown.`);
            setError(`Pool address unknown for ${fetchPair}`);
            return null;
        }
        if (poolAddress !== currentPoolAddress) setCurrentPoolAddress(poolAddress);
        try {
            const latestCandleData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchGeckoTerminalOhlcv"])(poolAddress, 'minute', 1, 1);
            const price = latestCandleData?.[0]?.close;
            if (typeof price === 'number') {
                return price;
            } else {
                console.warn(`Could not get latest close price for ${fetchPair} from GeckoTerminal.`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching current price for ${fetchPair} from GeckoTerminal:`, error.message);
            setError(`Failed to fetch price: ${error.message}`);
            return null;
        }
    }, [
        currentPoolAddress,
        setError
    ]); // Depends on currentPoolAddress state
    const handleStopLoss = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (position, currentPrice)=>{
        // Read latest settings directly from store inside the handler
        const latestSettings = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState().settings;
        const currentStopLossConfig = {
            enabled: true,
            percentage: latestSettings.stopLossPercentage
        };
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safetyFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkStopLoss"])(position, currentPrice, currentStopLossConfig)) return false;
        const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safetyFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatStopLossMessage"])(position, currentPrice, currentStopLossConfig);
        console.log(`STOP LOSS TRIGGERED: ${message}`);
        setStopLossTriggeredUI(true); // Update local UI state
        setStopLossMessageUI(message);
        if (!latestSettings.isTestMode) {
            try {
                setIsProcessingTrade(true);
                const exitAction = position.action === 'buy' ? 'sell' : 'buy';
                const amountInSmallestUnit = (position.amount * Math.pow(10, 9)).toString(); // Assuming 9 decimals
                const result = await executeTradeWithStrategy(position.action === 'buy' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOL_MINT"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["USDC_MINT"], position.action === 'buy' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["USDC_MINT"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOL_MINT"], amountInSmallestUnit, 0.5, 'Stop Loss', publicKey, sendTransaction, publicKey?.toBase58() || null);
                if (result.success) {
                    const exitTrade = {
                        id: `sl-${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        pair: position.pair,
                        action: exitAction,
                        amount: position.amount,
                        price: currentPrice,
                        strategy: 'Stop Loss',
                        success: true,
                        signature: result.signature
                    };
                    addTradeHistory(exitTrade);
                    removePosition(position.id);
                } else {
                    setError(`Stop loss trade failed: ${result.error}`);
                }
            } catch (error) {
                setError(`Error executing stop loss: ${error.message}`);
            } finally{
                if (isMountedRef.current) setIsProcessingTrade(false);
            } // Check mount status
        } else {
            const exitAction = position.action === 'buy' ? 'sell' : 'buy';
            const exitTrade = {
                id: `sl-sim-${Date.now()}`,
                timestamp: new Date().toISOString(),
                pair: position.pair,
                action: exitAction,
                amount: position.amount,
                price: currentPrice,
                strategy: 'Stop Loss',
                success: true,
                signature: 'simulated_stop_loss_' + Math.random().toString(36).substring(2, 9)
            };
            addTradeHistory(exitTrade);
            removePosition(position.id);
        }
        return true; // SL triggered
    }, [
        publicKey,
        sendTransaction,
        executeTradeWithStrategy,
        addTradeHistory,
        removePosition,
        setError
    ]); // Add dependencies
    const handleTakeProfit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (position, currentPrice)=>{
        const latestSettings = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState().settings;
        const currentTakeProfitConfig = {
            enabled: true,
            percentage: latestSettings.takeProfitPercentage
        };
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safetyFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkTakeProfit"])(position, currentPrice, currentTakeProfitConfig)) return false;
        const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safetyFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTakeProfitMessage"])(position, currentPrice, currentTakeProfitConfig);
        console.log(`TAKE PROFIT TRIGGERED: ${message}`);
        if (!latestSettings.isTestMode) {
            try {
                setIsProcessingTrade(true);
                const exitAction = position.action === 'buy' ? 'sell' : 'buy';
                const amountInSmallestUnit = (position.amount * Math.pow(10, 9)).toString();
                const result = await executeTradeWithStrategy(position.action === 'buy' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOL_MINT"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["USDC_MINT"], position.action === 'buy' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["USDC_MINT"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOL_MINT"], amountInSmallestUnit, 0.5, 'Take Profit', publicKey, sendTransaction, publicKey?.toBase58() || null);
                if (result.success) {
                    const exitTrade = {
                        id: `tp-${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        pair: position.pair,
                        action: exitAction,
                        amount: position.amount,
                        price: currentPrice,
                        strategy: 'Take Profit',
                        success: true,
                        signature: result.signature
                    };
                    addTradeHistory(exitTrade);
                    removePosition(position.id);
                } else {
                    setError(`Take profit trade failed: ${result.error}`);
                }
            } catch (error) {
                setError(`Error executing take profit: ${error.message}`);
            } finally{
                if (isMountedRef.current) setIsProcessingTrade(false);
            }
        } else {
            const exitAction = position.action === 'buy' ? 'sell' : 'buy';
            const exitTrade = {
                id: `tp-sim-${Date.now()}`,
                timestamp: new Date().toISOString(),
                pair: position.pair,
                action: exitAction,
                amount: position.amount,
                price: currentPrice,
                strategy: 'Take Profit',
                success: true,
                signature: 'simulated_take_profit_' + Math.random().toString(36).substring(2, 9)
            };
            addTradeHistory(exitTrade);
            removePosition(position.id);
        }
        return true; // TP triggered
    }, [
        publicKey,
        sendTransaction,
        executeTradeWithStrategy,
        addTradeHistory,
        removePosition,
        setError
    ]); // Add dependencies
    // Check Stop Loss and Take Profit for all active positions
    const checkPositionsSLTP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const currentActivePositions = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState().activePositions; // Get latest state
        const currentPair = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState().settings.pair; // Get latest pair
        const poolAddr = currentPoolAddress; // Use state pool address
        if (currentActivePositions.length === 0 || !poolAddr) return false;
        console.log("Checking SL/TP...");
        const currentPrice = await fetchCurrentPrice(currentPair);
        if (currentPrice) {
            console.log(`Current price for SL/TP check: ${currentPrice}`);
            for (const position of [
                ...currentActivePositions
            ]){
                const tpTriggered = await handleTakeProfit(position, currentPrice);
                if (tpTriggered) return true;
                const slTriggered = await handleStopLoss(position, currentPrice);
                if (slTriggered) return true;
            }
        } else {
            console.warn("Could not fetch current price for SL/TP check.");
        }
        return false;
    }, [
        currentPoolAddress,
        fetchCurrentPrice,
        handleTakeProfit,
        handleStopLoss
    ]); // Dependencies
    // Simulate a single trade action (entry only for now)
    const simulateTradeAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((simAction)=>{
        const { amount: currentAmount, pair: currentPair, strategyType: currentStrategy } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState().settings;
        console.log(`Simulating ${simAction} entry action...`);
        const simPrice = parseFloat((Math.random() * 100 + 50).toFixed(2));
        const simAmount = parseFloat((Math.random() * currentAmount).toFixed(3));
        const trade = {
            id: `sim-entry-${Date.now()}`,
            timestamp: new Date().toISOString(),
            pair: currentPair,
            action: simAction,
            amount: simAmount,
            price: simPrice,
            strategy: currentStrategy,
            success: true,
            signature: 'sim_entry_' + Math.random().toString(36).substring(2, 9)
        };
        addTradeHistory(trade);
        const newPosition = {
            id: `pos-${Date.now()}`,
            pair: currentPair,
            entryPrice: simPrice,
            amount: simAmount,
            timestamp: trade.timestamp,
            action: simAction
        };
        addPosition(newPosition);
    }, [
        addPosition,
        addTradeHistory
    ]); // Dependencies
    // Execute a real trade based on strategy decision (entry only for now)
    const executeRealTradeAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (tradeAction)=>{
        const { amount: currentAmount, pair: currentPair, strategyType: currentStrategy } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState().settings;
        const poolAddr = currentPoolAddress; // Use state pool address
        if (isProcessingTrade || !poolAddr) return;
        console.log(`Attempting real ${tradeAction} trade...`);
        setIsProcessingTrade(true);
        try {
            const inputMint = tradeAction === 'buy' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["USDC_MINT"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOL_MINT"];
            const outputMint = tradeAction === 'buy' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOL_MINT"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jupiter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["USDC_MINT"];
            const amountInSmallestUnit = (currentAmount * Math.pow(10, 9)).toString();
            const result = await executeTradeWithStrategy(inputMint, outputMint, amountInSmallestUnit, 0.5, currentStrategy, publicKey, sendTransaction, publicKey?.toBase58() || null);
            if (result.success && result.expectedOutputAmount) {
                const approxPrice = parseFloat(result.inputAmount || '0') / parseFloat(result.expectedOutputAmount);
                const trade = {
                    id: `real-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    pair: currentPair,
                    action: tradeAction,
                    amount: currentAmount,
                    price: isNaN(approxPrice) ? 0 : approxPrice,
                    strategy: currentStrategy,
                    success: true,
                    signature: result.signature
                };
                addTradeHistory(trade);
                const newPosition = {
                    id: `pos-${Date.now()}`,
                    pair: currentPair,
                    entryPrice: isNaN(approxPrice) ? 0 : approxPrice,
                    amount: currentAmount,
                    timestamp: trade.timestamp,
                    action: tradeAction
                };
                addPosition(newPosition);
            } else {
                setError(`Trade execution failed: ${result.error}`);
                const failedTrade = {
                    id: `fail-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    pair: currentPair,
                    action: tradeAction,
                    amount: currentAmount,
                    price: 0,
                    strategy: currentStrategy,
                    success: false,
                    error: result.error
                };
                addTradeHistory(failedTrade);
            }
        } catch (e) {
            setError(`Trade execution error: ${e.message}`);
        } finally{
            if (isMountedRef.current) setIsProcessingTrade(false);
        }
    }, [
        currentPoolAddress,
        executeTradeWithStrategy,
        publicKey,
        sendTransaction,
        addTradeHistory,
        addPosition,
        setError
    ]); // Dependencies
    // --- Combined Bot Lifecycle Effect ---
    const isMountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true); // Ref to track mount status
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        isMountedRef.current = true;
        let analysisRunning = false; // Local flag to prevent concurrent analysis runs
        // Function to perform the core trading loop logic
        const loopLogic = async ()=>{
            if (!isMountedRef.current || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState().status !== 'running') return;
            if (isProcessingTrade) {
                console.log("Skipping loop iteration: Trade/Analysis in progress.");
                return;
            }
            console.log("Trading loop iteration...");
            setIsProcessingTrade(true);
            const { settings: currentSettings, activePositions: currentActivePositions } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState();
            const { strategyType: currentStrategyType, action: currentAction, isTestMode: currentTestMode } = currentSettings;
            const currentAnalysis = analysisResult; // Use analysis result from component state
            const poolAddr = currentPoolAddress; // Use pool address from component state
            if (!poolAddr || !currentAnalysis) {
                console.error("Missing pool address or analysis result for loop logic.");
                setError("Internal error: Missing data for trading loop.");
                storeStopBot();
                setIsProcessingTrade(false);
                return;
            }
            // --- Check Strategy Exit / SL / TP ---
            if (currentActivePositions.length > 0) {
                const positionClosed = await checkPositionsSLTP();
                if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState().activePositions.length === 0 && currentActivePositions.length > 0) {
                    console.log("Position closed by SL/TP/Strategy Exit.");
                    setIsProcessingTrade(false);
                    return;
                }
            }
            // --- Check Entry Conditions ---
            let shouldEnterTrade = false;
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState().activePositions.length === 0) {
                console.log("No active position. Checking entry conditions...");
                const fifteenMinData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchGeckoTerminalOhlcv"])(poolAddr, 'minute', 15, 10);
                if (fifteenMinData && currentAnalysis) {
                    if (currentStrategyType === 'TrendTracker') {
                        shouldEnterTrade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketAnalysis$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkTrendTrackerEntry"])(currentAnalysis, fifteenMinData);
                    } else if (currentStrategyType === 'SmartRange Scout') {
                        shouldEnterTrade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketAnalysis$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkSmartRangeEntry"])(currentAnalysis, fifteenMinData);
                    }
                } else {
                    console.warn("Could not fetch recent 15min data or analysis result missing for entry check.");
                }
            } else {
                console.log("Position already active, skipping entry check.");
            }
            // --- Execute Trade ---
            if (shouldEnterTrade) {
                console.log(`Entry conditions met for ${currentStrategyType}. Attempting trade...`);
                if (currentTestMode) {
                    simulateTradeAction(currentAction);
                } else {
                    await executeRealTradeAction(currentAction);
                }
            } else {
                console.log("Entry conditions not met or position already open.");
            }
            setIsProcessingTrade(false);
        };
        // --- Effect Logic ---
        if (status === 'analyzing' && !analysisRunning) {
            analysisRunning = true;
            const runInitialAnalysis = async ()=>{
                if (!isMountedRef.current) return;
                console.log("Starting initial market analysis...");
                setIsProcessingTrade(true);
                const poolAddress = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findPoolAddress"])(pair);
                if (!isMountedRef.current) {
                    analysisRunning = false;
                    return;
                }
                if (!poolAddress) {
                    setError(`Could not find pool address for pair: ${pair}`);
                    storeStopBot();
                    if (isMountedRef.current) setIsProcessingTrade(false);
                    analysisRunning = false;
                    return;
                }
                if (isMountedRef.current) setCurrentPoolAddress(poolAddress);
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$marketAnalysis$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assessMarketStructure"])(poolAddress);
                if (!isMountedRef.current) {
                    analysisRunning = false;
                    return;
                }
                setAnalysisResult(result);
                setMarketCondition(result.condition);
                if (result.condition === 'Unclear') {
                    console.log("Market condition unclear, bot will not start.");
                    setError("Market condition unclear. Bot stopped.");
                    storeStopBot();
                } else {
                    console.log(`Initial analysis complete. Market Condition: ${result.condition}. Starting trading loop.`);
                    if (isMountedRef.current) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].setState({
                            status: 'running'
                        }); // Trigger the 'running' state
                    }
                }
                if (isMountedRef.current) setIsProcessingTrade(false);
                analysisRunning = false;
            };
            runInitialAnalysis();
        } else if (status === 'running') {
            if (!tradingIntervalRef.current && currentPoolAddress && analysisResult) {
                console.log(`Setting up trading loop interval: ${settings.runIntervalMinutes} mins.`);
                // Run first loop logic slightly delayed to allow state to settle?
                // setTimeout(loopLogic, 100); // Optional small delay
                loopLogic(); // Run first iteration
                tradingIntervalRef.current = setInterval(loopLogic, settings.runIntervalMinutes * 60 * 1000);
            }
        } else if (status === 'stopped') {
            if (tradingIntervalRef.current) {
                clearInterval(tradingIntervalRef.current);
                tradingIntervalRef.current = null;
                console.log("Trading loop stopped.");
            }
        }
        // Cleanup
        return ()=>{
            isMountedRef.current = false;
            if (tradingIntervalRef.current) {
                clearInterval(tradingIntervalRef.current);
                tradingIntervalRef.current = null;
                console.log("Cleaning up trading loop interval.");
            }
        };
    // Only depend on status and pair to trigger analysis or setup/teardown interval
    }, [
        status,
        pair
    ]);
    // --- Event Handlers ---
    const handleStartBot = ()=>{
        if (!isWalletConnected || !publicKey) {
            alert("Please connect your Phantom wallet first");
            return;
        }
        setStopLossTriggeredUI(false);
        setStopLossMessageUI('');
        setError(null);
        setAnalysisResult(null);
        setCurrentPoolAddress(null); // Reset pool address on start
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useBotStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].setState({
            status: 'analyzing',
            errorMessage: null,
            currentRun: 0
        }); // Trigger analysis
    };
    const handleStopBot = ()=>{
        storeStopBot(); // Sets status to 'stopped', useEffect clears interval
    };
    const handleToggleTestMode = ()=>{
        if (status === 'running' || status === 'analyzing') {
            alert("Please stop the bot before changing test mode.");
            return;
        }
        storeToggleTestMode();
    };
    // Handler for SL/TP/Runs/Interval/Compounding changes
    const handleSettingChange = (e)=>{
        const { name, value, type } = e.target;
        let parsedValue = value;
        if (type === 'number') {
            parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) return;
            if ((name === 'stopLossPercentage' || name === 'takeProfitPercentage') && parsedValue < 0) parsedValue = 0;
            if (name === 'maxRuns' && parsedValue < 1) parsedValue = 1;
            if (name === 'runIntervalMinutes' && parsedValue < 1) parsedValue = 1;
        } else if (type === 'checkbox') {
            parsedValue = e.target.checked;
        }
        setSettings({
            [name]: parsedValue
        });
    };
    // --- JSX Rendering ---
    const isRunning = status === 'running' || status === 'analyzing';
    const lastTrade = tradeHistory.length > 0 ? tradeHistory[0] : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-gray-800 p-6 rounded-lg shadow-lg space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-xl font-bold text-white",
                children: "Bot Control"
            }, void 0, false, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 497,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "testModeToggle",
                        className: "mr-2 text-gray-300",
                        children: "Test Mode:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 501,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "testModeToggle",
                        onClick: handleToggleTestMode,
                        className: `px-3 py-1 rounded-md text-sm font-medium transition-colors ${isTestMode ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-500'} ${status !== 'stopped' ? 'opacity-50 cursor-not-allowed' : 'text-white'}`,
                        disabled: status !== 'stopped',
                        children: isTestMode ? 'Enabled' : 'Disabled'
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 502,
                        columnNumber: 9
                    }, this),
                    !isTestMode && status === 'stopped' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-2 text-red-400 text-xs italic",
                        children: "Warning: Real trading active!"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 513,
                        columnNumber: 11
                    }, this),
                    status !== 'stopped' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-2 text-yellow-400 text-xs italic",
                        children: "Stop bot to change mode"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 516,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 500,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "stopLossPercentage",
                        className: "mr-2 text-gray-300 whitespace-nowrap",
                        children: "Stop Loss (%):"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 522,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        id: "stopLossPercentage",
                        name: "stopLossPercentage",
                        value: stopLossPercentage,
                        onChange: handleSettingChange,
                        min: "0",
                        step: "0.1",
                        className: "w-full bg-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm",
                        disabled: isRunning
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 523,
                        columnNumber: 10
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 521,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "takeProfitPercentage",
                        className: "mr-2 text-gray-300 whitespace-nowrap",
                        children: "Take Profit (%):"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 538,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        id: "takeProfitPercentage",
                        name: "takeProfitPercentage",
                        value: takeProfitPercentage,
                        onChange: handleSettingChange,
                        min: "0",
                        step: "0.1",
                        className: "w-full bg-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm",
                        disabled: isRunning
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 539,
                        columnNumber: 10
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 537,
                columnNumber: 8
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "maxRuns",
                        className: "mr-2 text-gray-300 whitespace-nowrap",
                        children: "Max Runs:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 554,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        id: "maxRuns",
                        name: "maxRuns",
                        value: maxRuns,
                        onChange: handleSettingChange,
                        min: "1",
                        step: "1",
                        className: "w-full bg-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm",
                        disabled: isRunning
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 555,
                        columnNumber: 10
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 553,
                columnNumber: 8
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "runIntervalMinutes",
                        className: "mr-2 text-gray-300 whitespace-nowrap",
                        children: "Run Interval (min):"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 570,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        id: "runIntervalMinutes",
                        name: "runIntervalMinutes",
                        value: runIntervalMinutes,
                        onChange: handleSettingChange,
                        min: "1",
                        step: "1",
                        className: "w-full bg-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm",
                        disabled: isRunning
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 571,
                        columnNumber: 10
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 569,
                columnNumber: 8
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "compoundCapital",
                        className: "mr-2 text-gray-300",
                        children: "Compound Capital:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 586,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        id: "compoundCapital",
                        name: "compoundCapital",
                        checked: compoundCapital,
                        onChange: handleSettingChange,
                        className: "form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800",
                        disabled: isRunning
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 587,
                        columnNumber: 10
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 585,
                columnNumber: 8
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex space-x-4 pt-2",
                children: status !== 'running' && status !== 'analyzing' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleStartBot,
                    className: "flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    disabled: !isWalletConnected || !publicKey || isProcessingTrade || status === 'error',
                    children: isProcessingTrade ? 'Processing...' : status === 'error' ? 'Error Occurred' : 'Start Trading'
                }, void 0, false, {
                    fileName: "[project]/src/components/BotControl.tsx",
                    lineNumber: 602,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleStopBot,
                    className: "flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    disabled: isProcessingTrade,
                    children: status === 'analyzing' ? 'Stop Analysis' : 'Stop Trading'
                }, void 0, false, {
                    fileName: "[project]/src/components/BotControl.tsx",
                    lineNumber: 610,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 600,
                columnNumber: 7
            }, this),
            status !== 'stopped' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gray-900 p-3 rounded-md text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `w-3 h-3 rounded-full mr-2 ${status === 'running' ? 'bg-green-500 animate-pulse' : status === 'analyzing' ? 'bg-yellow-500 animate-pulse' : status === 'error' ? 'bg-red-500' : 'bg-gray-500' // Should not happen if not stopped
                            }`
                        }, void 0, false, {
                            fileName: "[project]/src/components/BotControl.tsx",
                            lineNumber: 624,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm text-gray-300",
                            children: [
                                "Bot status: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: status
                                }, void 0, false, {
                                    fileName: "[project]/src/components/BotControl.tsx",
                                    lineNumber: 630,
                                    columnNumber: 29
                                }, this),
                                status === 'running' && ` (${strategyType})`
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/BotControl.tsx",
                            lineNumber: 629,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/BotControl.tsx",
                    lineNumber: 623,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 622,
                columnNumber: 9
            }, this),
            status === 'error' && errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 bg-red-900/50 p-3 rounded-md text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-300 text-sm",
                        children: errorMessage
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 640,
                        columnNumber: 14
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 639,
                columnNumber: 10
            }, this),
            stopLossTriggeredUI && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 bg-red-900/50 p-3 rounded-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-3 h-3 bg-red-500 rounded-full mr-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/BotControl.tsx",
                            lineNumber: 649,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-300 text-sm",
                            children: stopLossMessageUI
                        }, void 0, false, {
                            fileName: "[project]/src/components/BotControl.tsx",
                            lineNumber: 650,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/BotControl.tsx",
                    lineNumber: 648,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 647,
                columnNumber: 9
            }, this),
            activePositions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-bold mb-2 text-white",
                        children: "Active Positions"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 658,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-900 p-3 rounded-md max-h-40 overflow-y-auto",
                        children: activePositions.map((position)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-b border-gray-700 py-2 last:border-0 text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400",
                                            children: [
                                                "Pair: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-200",
                                                    children: position.pair
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/BotControl.tsx",
                                                    lineNumber: 663,
                                                    columnNumber: 56
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 663,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400",
                                            children: [
                                                "Action: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: position.action === 'buy' ? 'text-green-400' : 'text-red-400',
                                                    children: position.action
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/BotControl.tsx",
                                                    lineNumber: 664,
                                                    columnNumber: 58
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 664,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400",
                                            children: [
                                                "Amount: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-200",
                                                    children: position.amount
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/BotControl.tsx",
                                                    lineNumber: 665,
                                                    columnNumber: 58
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 665,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400",
                                            children: [
                                                "Entry: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-200",
                                                    children: [
                                                        "$",
                                                        position.entryPrice.toFixed(4)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/BotControl.tsx",
                                                    lineNumber: 666,
                                                    columnNumber: 57
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 666,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400",
                                            children: [
                                                "Stop Loss: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-200",
                                                    children: [
                                                        "$",
                                                        (position.action === 'buy' ? position.entryPrice * (1 - stopLossPercentage / 100) : position.entryPrice * (1 + stopLossPercentage / 100)).toFixed(4)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/BotControl.tsx",
                                                    lineNumber: 667,
                                                    columnNumber: 61
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 667,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400",
                                            children: [
                                                "Time: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-200",
                                                    children: new Date(position.timestamp).toLocaleTimeString()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/BotControl.tsx",
                                                    lineNumber: 670,
                                                    columnNumber: 56
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 670,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/BotControl.tsx",
                                    lineNumber: 662,
                                    columnNumber: 17
                                }, this)
                            }, position.id, false, {
                                fileName: "[project]/src/components/BotControl.tsx",
                                lineNumber: 661,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 659,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 657,
                columnNumber: 9
            }, this),
            lastTrade && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-bold mb-2 text-white",
                        children: "Last Trade"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 681,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-900 p-3 rounded-md text-xs",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-400",
                                    children: [
                                        "Pair: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-200",
                                            children: lastTrade.pair
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 684,
                                            columnNumber: 52
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/BotControl.tsx",
                                    lineNumber: 684,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-400",
                                    children: [
                                        "Action: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: lastTrade.action === 'buy' ? 'text-green-400' : 'text-red-400',
                                            children: lastTrade.action
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 685,
                                            columnNumber: 54
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/BotControl.tsx",
                                    lineNumber: 685,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-400",
                                    children: [
                                        "Amount: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-200",
                                            children: lastTrade.amount
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 686,
                                            columnNumber: 54
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/BotControl.tsx",
                                    lineNumber: 686,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-400",
                                    children: [
                                        "Price: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-200",
                                            children: [
                                                "$",
                                                Number(lastTrade.price).toFixed(4)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 688,
                                            columnNumber: 53
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/BotControl.tsx",
                                    lineNumber: 688,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-400",
                                    children: [
                                        "Status: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: lastTrade.success ? 'text-green-400' : 'text-red-400',
                                            children: lastTrade.success ? 'Success' : 'Failed'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 689,
                                            columnNumber: 54
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/BotControl.tsx",
                                    lineNumber: 689,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-400",
                                    children: [
                                        "Time: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-200",
                                            children: new Date(lastTrade.timestamp).toLocaleTimeString()
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 690,
                                            columnNumber: 52
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/BotControl.tsx",
                                    lineNumber: 690,
                                    columnNumber: 15
                                }, this),
                                lastTrade.signature && !lastTrade.signature.startsWith('sim') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `https://solscan.io/tx/${lastTrade.signature}`,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-blue-400 hover:underline",
                                        children: "View on Solscan"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BotControl.tsx",
                                        lineNumber: 693,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/BotControl.tsx",
                                    lineNumber: 692,
                                    columnNumber: 17
                                }, this),
                                lastTrade.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2 text-red-400",
                                    children: [
                                        "Error: ",
                                        lastTrade.error
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/BotControl.tsx",
                                    lineNumber: 704,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/BotControl.tsx",
                            lineNumber: 683,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 682,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 680,
                columnNumber: 9
            }, this),
            tradeHistory.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-bold mb-2 text-white",
                        children: "Recent Trades"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 714,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-60 overflow-y-auto space-y-2",
                        children: tradeHistory.map((trade)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-900 p-2 rounded-md text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium text-gray-300",
                                                children: [
                                                    trade.pair,
                                                    " - ",
                                                    trade.action.toUpperCase()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/BotControl.tsx",
                                                lineNumber: 719,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-400",
                                                children: new Date(trade.timestamp).toLocaleTimeString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/BotControl.tsx",
                                                lineNumber: 720,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/BotControl.tsx",
                                        lineNumber: 718,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-300",
                                                children: [
                                                    trade.amount,
                                                    " @ $",
                                                    Number(trade.price).toFixed(4)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/BotControl.tsx",
                                                lineNumber: 724,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `font-semibold ${trade.success ? 'text-green-500' : 'text-red-500'}`,
                                                children: trade.success ? 'Success' : 'Failed'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/BotControl.tsx",
                                                lineNumber: 725,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/BotControl.tsx",
                                        lineNumber: 722,
                                        columnNumber: 17
                                    }, this),
                                    trade.signature && !trade.signature.startsWith('sim') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: `https://solscan.io/tx/${trade.signature}`,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "text-blue-400 hover:underline text-xs",
                                            children: "View Tx"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/BotControl.tsx",
                                            lineNumber: 731,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BotControl.tsx",
                                        lineNumber: 730,
                                        columnNumber: 19
                                    }, this),
                                    trade.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-red-400 text-xs",
                                        children: [
                                            "Error: ",
                                            trade.error
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/BotControl.tsx",
                                        lineNumber: 742,
                                        columnNumber: 20
                                    }, this)
                                ]
                            }, trade.id || trade.timestamp, true, {
                                fileName: "[project]/src/components/BotControl.tsx",
                                lineNumber: 717,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/BotControl.tsx",
                        lineNumber: 715,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BotControl.tsx",
                lineNumber: 713,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/BotControl.tsx",
        lineNumber: 496,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = BotControl;
}}),
"[project]/src/components/BotControl.tsx [app-ssr] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/BotControl.tsx [app-ssr] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__11e80613._.js.map