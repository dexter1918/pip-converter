// ─── Error message constants (fixes: inconsistent error strings) ───────────────
const ERR_POSTFIX = "The entered postfix expression is not correct";
const ERR_PREFIX  = "The entered prefix expression is not correct";
const ERR_INFIX   = "The entered infix expression is not correct";

// ─── combCheck ────────────────────────────────────────────────────────────────
function combCheck() {
    var inp = document.getElementById("input").value;
    var s1  = document.first_dd.exp1.value;
    var s2  = document.second_dd.exp2.value;
    var output = "";

    if (inp === "") {
        output = "Enter the Expression!";
    } else if (s1 === "--From--" || s2 === "--To--") {
        output = "Choose From The Dropdowns!";
    } else if (s1 === s2) {
        output = "Choose another combination!";
    } else {
        var comb = s1 + "→" + s2;
        switch (comb) {
            case "post→in":  output = postToIn(inp);  break;
            case "pre→in":   output = preToIn(inp);   break;
            case "in→post":  output = inToPost(inp);  break;
            case "in→pre":   output = inToPre(inp);   break;
            case "post→pre": {
                var mid = postToIn(inp);
                output = (mid === ERR_POSTFIX) ? mid : inToPre(mid);
                if (output === ERR_INFIX) output = ERR_POSTFIX;
                break;
            }
            case "pre→post": {
                var mid = preToIn(inp);
                output = (mid === ERR_PREFIX) ? mid : inToPost(mid);
                if (output === ERR_INFIX) output = ERR_PREFIX;
                break;
            }
        }
    }

    // Fix: avoid var redeclaration; use textContent to prevent XSS
    clearcontent();
    var p = document.createElement("p");
    p.id = "output";
    p.className = "output-display";
    p.textContent = output;          // textContent — no HTML injection possible
    document.body.appendChild(p);
}

// ─── postToIn — Postfix → Infix ───────────────────────────────────────────────
function postToIn(st) {
    var stack = [];

    // Fix: use a regular for loop — for…in is for object keys, not string chars
    for (var i = 0; i < st.length; i++) {
        var ch = st[i];
        if (isOperand(ch)) {
            stack.push(ch);
        } else if (isOperator(ch)) {
            if (stack.length < 2) return ERR_POSTFIX;
            var right = stack.pop();
            var left  = stack.pop();
            stack.push("(" + left + ch + right + ")");
            // Fix: count was never incremented after push — now stack.length is
            // used directly, so this class of bug cannot recur.
        } else {
            return ERR_POSTFIX; // unrecognised character
        }
    }

    if (stack.length !== 1) return ERR_POSTFIX;
    return stack[0];
}

// ─── preToIn — Prefix → Infix ─────────────────────────────────────────────────
function preToIn(st) {
    var stack = [];

    for (var i = st.length - 1; i >= 0; i--) {
        var ch = st[i];
        if (isOperand(ch)) {
            stack.push(ch);
        } else if (isOperator(ch)) {
            if (stack.length < 2) return ERR_PREFIX;
            var left  = stack.pop();
            var right = stack.pop();
            stack.push("(" + left + ch + right + ")");
        } else {
            return ERR_PREFIX;
        }
    }

    if (stack.length !== 1) return ERR_PREFIX;
    return stack[0];
}

// ─── inToPost — Infix → Postfix ───────────────────────────────────────────────
function inToPost(st) {
    // Quick boundary check
    if (st.length === 0) return ERR_INFIX;
    var first = st[0], last = st[st.length - 1];
    if (isOperator(first) || last === "(" || isOperator(last) || first === ")")
        return ERR_INFIX;

    var output = "";
    var opStack = [];       // operator/bracket stack
    var prioStack = [];     // parallel priority stack

    // Fix: split error tracking into two dedicated variables
    var bracketDepth = 0;
    var hasError     = false;

    for (var i = 0; i < st.length; i++) {
        var ch   = st[i];
        var prev = i > 0 ? st[i - 1] : null;

        if (isOperand(ch)) {
            // Two consecutive operands → invalid
            if (prev !== null && (isOperand(prev) || prev === ")")) {
                hasError = true; break;
            }
            output += ch;

        } else if (ch === "(") {
            if (prev !== null && (isOperand(prev) || prev === ")")) {
                hasError = true; break;
            }
            opStack.push(ch);
            prioStack.push(0);      // lowest priority inside stack
            bracketDepth++;

        } else if (ch === ")") {
            if (prev === null || isOperator(prev) || prev === "(") {
                hasError = true; break;
            }
            bracketDepth--;
            if (bracketDepth < 0) { hasError = true; break; }

            // Pop until matching "("
            while (opStack.length > 0 && opStack[opStack.length - 1] !== "(") {
                output += opStack.pop();
                prioStack.pop();
            }
            if (opStack.length === 0) { hasError = true; break; }
            opStack.pop();   // discard "("
            prioStack.pop();

        } else if (isOperator(ch)) {
            if (prev === null || isOperator(prev) || prev === "(") {
                // Fix: guard added for * and / (was missing — could read st[-1])
                hasError = true; break;
            }
            var prio = priority(ch);
            opStack.push(ch);
            prioStack.push(prio);

            // Fix: pop from the TOP of the stack correctly (index length-1)
            // Fix: ^ is right-associative — only pop when strictly less priority
            while (opStack.length >= 2) {
                var topPrio  = prioStack[prioStack.length - 1];
                var prevPrio = prioStack[prioStack.length - 2];
                // For ^, right-associative: only pop if prevPrio > topPrio
                // For others: pop if prevPrio >= topPrio
                var shouldPop = (ch === "^")
                    ? prevPrio > topPrio
                    : prevPrio >= topPrio;
                // Don't pop past a bracket (priority 0 acts as sentinel)
                if (shouldPop && prevPrio !== 0) {
                    // Remove the element just below the top
                    var belowOp = opStack[opStack.length - 2];
                    opStack.splice(opStack.length - 2, 1);
                    prioStack.splice(prioStack.length - 2, 1);
                    output += belowOp;
                } else {
                    break;
                }
            }
        } else {
            hasError = true; break;   // unknown character
        }
    }

    if (hasError || bracketDepth !== 0) return ERR_INFIX;

    while (opStack.length > 0) {
        output += opStack.pop();
        prioStack.pop();
    }
    return output;
}

// ─── inToPre — Infix → Prefix ─────────────────────────────────────────────────
function inToPre(st) {
    // Validate first
    if (inToPost(st) === ERR_INFIX) return ERR_INFIX;

    // Reverse + swap brackets → postfix of reversed → reverse result
    var chars = st.split("").reverse().map(function(c) {
        return c === "(" ? ")" : c === ")" ? "(" : c;
    });
    var reversed = chars.join("");
    var post = inToPost(reversed);
    if (post === ERR_INFIX) return ERR_INFIX;
    return post.split("").reverse().join("");
}

// ─── swap ─────────────────────────────────────────────────────────────────────
function swap() {
    if (document.first_dd.exp1.value  !== "--From--" &&
        document.second_dd.exp2.value !== "--To--") {
        var temp = document.first_dd.exp1.value;
        document.first_dd.exp1.value  = document.second_dd.exp2.value;
        document.second_dd.exp2.value = temp;
    }
}

// ─── DOM helpers ──────────────────────────────────────────────────────────────
function clearcontent() {
    var el = document.getElementById("output");
    if (el) el.remove();
}

function clearinputbox() {
    document.getElementById("input").value = "";
    clearcontent();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isOperand(ch) {
    var c = ch.charCodeAt(0);
    return (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
}

function isOperator(ch) {
    return ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "^";
}

function priority(op) {
    if (op === "^")              return 3;
    if (op === "*" || op === "/") return 2;
    if (op === "+" || op === "-") return 1;
    return 0;
}

// Fix: F12 block removed — client-side source protection is ineffective and
// hostile to legitimate developers. The handler has been deleted entirely.
