(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/littlefoot/dist/littlefoot.js
  var require_littlefoot = __commonJS({
    "node_modules/littlefoot/dist/littlefoot.js"(exports, module) {
      !function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).littlefoot = {});
      }(exports, function(t) {
        "use strict";
        var e = function() {
          return e = Object.assign || function(t2) {
            for (var e2, n2 = 1, r2 = arguments.length; n2 < r2; n2++) for (var i2 in e2 = arguments[n2]) Object.prototype.hasOwnProperty.call(e2, i2) && (t2[i2] = e2[i2]);
            return t2;
          }, e.apply(this, arguments);
        };
        function n(t2, e2) {
          t2.classList.add(e2);
        }
        function r(t2, e2) {
          t2.classList.remove(e2);
        }
        function i(t2, e2) {
          return t2.classList.contains(e2);
        }
        "function" == typeof SuppressedError && SuppressedError;
        var o, u = {};
        function c() {
          if (o) return u;
          return o = 1, Object.defineProperty(u, "__esModule", { value: true }), u.getStyle = void 0, u.getStyle = function(t2, e2) {
            var n2, r2 = ((null === (n2 = t2.ownerDocument) || void 0 === n2 ? void 0 : n2.defaultView) || window).getComputedStyle(t2);
            return r2.getPropertyValue(e2) || r2[e2];
          }, u;
        }
        var a, l = c(), s = {};
        function f() {
          if (a) return s;
          a = 1, Object.defineProperty(s, "__esModule", { value: true }), s.pixels = void 0;
          var t2 = c(), e2 = 96, n2 = 25.4;
          function r2(e3) {
            return e3 ? (0, t2.getStyle)(e3, "fontSize") || r2(e3.parentElement) : (0, t2.getStyle)(window.document.documentElement, "fontSize");
          }
          return s.pixels = function t3(i2, o2) {
            var u2, c2, a2 = null !== (c2 = null === (u2 = null == o2 ? void 0 : o2.ownerDocument) || void 0 === u2 ? void 0 : u2.defaultView) && void 0 !== c2 ? c2 : window, l2 = a2.document.documentElement || a2.document.body, s2 = function(t4) {
              var e3, n3 = t4 || "0", r3 = parseFloat(n3), i3 = n3.match(/[\d-.]+(\w+)$/);
              return [r3, (null !== (e3 = null == i3 ? void 0 : i3[1]) && void 0 !== e3 ? e3 : "").toLowerCase()];
            }(i2), f2 = s2[0];
            switch (s2[1]) {
              case "rem":
                return f2 * t3(r2(window.document.documentElement));
              case "em":
                return f2 * t3(r2(o2), null == o2 ? void 0 : o2.parentElement);
              case "in":
                return f2 * e2;
              case "q":
                return f2 * e2 / n2 / 4;
              case "mm":
                return f2 * e2 / n2;
              case "cm":
                return f2 * e2 * 10 / n2;
              case "pt":
                return f2 * e2 / 72;
              case "pc":
                return f2 * e2 / 6;
              case "vh":
                return (f2 * a2.innerHeight || l2.clientWidth) / 100;
              case "vw":
                return (f2 * a2.innerWidth || l2.clientHeight) / 100;
              case "vmin":
                return f2 * Math.min(a2.innerWidth || l2.clientWidth, a2.innerHeight || l2.clientHeight) / 100;
              case "vmax":
                return f2 * Math.max(a2.innerWidth || l2.clientWidth, a2.innerHeight || l2.clientHeight) / 100;
              default:
                return f2;
            }
          }, s;
        }
        var d = f(), v = "littlefoot__tooltip";
        function m(t2) {
          var e2 = Number.parseFloat(l.getStyle(t2, "marginLeft")), n2 = t2.offsetWidth - e2;
          return (t2.getBoundingClientRect().left + n2 / 2) / window.innerWidth;
        }
        function p(t2, e2, i2) {
          var o2 = function(t3, e3) {
            var n2 = Number.parseInt(l.getStyle(e3, "marginTop"), 10), r2 = 2 * n2 + e3.offsetHeight, i3 = t3.getBoundingClientRect().top + t3.offsetHeight / 2, o3 = window.innerHeight - i3;
            return o3 >= r2 || o3 >= i3 ? ["below", o3 - n2 - 15] : ["above", i3 - n2 - 15];
          }(e2, t2), u2 = o2[0], c2 = o2[1];
          if (i2 !== u2) {
            r(t2, "is-" + i2), n(t2, "is-" + u2);
            var a2 = 100 * m(e2) + "%", s2 = "above" === u2 ? "100%" : "0";
            t2.style.transformOrigin = a2 + " " + s2;
          }
          return [u2, c2];
        }
        var h = "is-active", g = "is-changing", y = "is-scrollable", b = function(t2) {
          return document.body.contains(t2);
        };
        function w(t2) {
          var e2 = t2.id, o2 = t2.button, u2 = t2.content, c2 = t2.host, a2 = t2.popover, s2 = t2.wrapper, f2 = 0, w2 = "above";
          return { id: e2, activate: function(t3) {
            var e3;
            o2.setAttribute("aria-expanded", "true"), n(o2, g), n(o2, h), o2.insertAdjacentElement("afterend", a2), a2.style.maxWidth = document.body.clientWidth + "px", e3 = u2, f2 = Math.round(d.pixels(l.getStyle(e3, "maxHeight"), e3)), null == t3 || t3(a2, o2);
          }, dismiss: function(t3) {
            o2.setAttribute("aria-expanded", "false"), n(o2, g), r(o2, h), r(a2, h), null == t3 || t3(a2, o2);
          }, isActive: function() {
            return i(o2, h);
          }, isReady: function() {
            return !i(o2, g);
          }, ready: function() {
            n(a2, h), r(o2, g);
          }, remove: function() {
            a2.remove(), r(o2, g);
          }, reposition: function() {
            if (b(a2)) {
              var t3 = p(a2, o2, w2), e3 = t3[0], i2 = t3[1];
              w2 = e3, u2.style.maxHeight = Math.min(f2, i2) + "px", a2.offsetHeight < u2.scrollHeight ? (n(a2, y), u2.setAttribute("tabindex", "0")) : (r(a2, y), u2.removeAttribute("tabindex"));
            }
          }, resize: function() {
            b(a2) && (a2.style.left = function(t3, e3) {
              var n2 = t3.offsetWidth;
              return -m(e3) * n2 + Number.parseInt(l.getStyle(e3, "marginLeft"), 10) + e3.offsetWidth / 2;
            }(u2, o2) + "px", s2.style.maxWidth = u2.offsetWidth + "px", function(t3, e3) {
              var n2 = t3.querySelector("." + v);
              n2 && (n2.style.left = 100 * m(e3) + "%");
            }(a2, o2));
          }, destroy: function() {
            return c2.remove();
          } };
        }
        var E, S = {};
        function x() {
          if (E) return S;
          return E = 1, Object.defineProperty(S, "__esModule", { value: true }), S.throttle = void 0, S.throttle = function(t2, e2) {
            void 0 === e2 && (e2 = 0);
            var n2, r2 = 0;
            return Object.assign(function() {
              for (var i2 = [], o2 = 0; o2 < arguments.length; o2++) i2[o2] = arguments[o2];
              var u2 = Math.max(0, r2 + e2 - Date.now());
              u2 ? (clearTimeout(n2), n2 = setTimeout(function() {
                r2 = Date.now(), t2.apply(void 0, i2);
              }, u2)) : (r2 = Date.now(), t2.apply(void 0, i2));
            }, { cancel: function() {
              r2 = 0, clearTimeout(n2);
            } });
          }, S;
        }
        var D = x(), H = "is-fully-scrolled", A = function(t2) {
          return function(e2) {
            var i2 = e2.currentTarget, o2 = -e2.deltaY;
            o2 > 0 && r(t2, H), i2 && o2 <= 0 && o2 < i2.clientHeight + i2.scrollTop - i2.scrollHeight && n(t2, H);
          };
        };
        var T = "littlefoot__content", _ = "littlefoot__wrapper", M = "littlefoot--print", O = function() {
          for (var t2 = [], e2 = 0; e2 < arguments.length; e2++) t2[e2] = arguments[e2];
          return t2.forEach(function(t3) {
            return n(t3, M);
          });
        };
        function W(t2, e2) {
          return Array.from(t2.querySelectorAll(e2));
        }
        function L(t2, e2) {
          return t2.querySelector("." + e2) || t2.firstElementChild || t2;
        }
        function C(t2) {
          var e2 = document.createElement("div");
          e2.innerHTML = t2;
          var n2 = e2.firstElementChild;
          return n2.remove(), n2;
        }
        function P(t2) {
          return void 0 !== t2;
        }
        function j(t2) {
          var e2 = t2.parentElement, n2 = W(e2, ":scope > :not(." + M + ")"), r2 = n2.filter(function(t3) {
            return "HR" === t3.tagName;
          });
          n2.length === r2.length && (O.apply(void 0, r2.concat(e2)), j(e2));
        }
        function R(t2, e2) {
          var n2 = t2.parentElement;
          t2.remove(), n2 && n2 !== e2 && !n2.innerHTML.replace(/(\[\]|&nbsp;|\s)/g, "") && R(n2, e2);
        }
        function z(t2, e2) {
          var n2 = t2[0], r2 = t2[1], i2 = t2[2], o2 = C(i2.outerHTML);
          W(o2, '[href$="#' + n2 + '"]').forEach(function(t3) {
            return R(t3, o2);
          });
          var u2 = o2.innerHTML.trim();
          return [r2, i2, { id: String(e2 + 1), number: e2 + 1, reference: "lf-" + n2, content: u2.startsWith("<") ? u2 : "<p>" + u2 + "</p>" }];
        }
        function k(t2) {
          return function(e2) {
            return t2.replace(/<%=?\s*(\w+?)\s*%>/g, function(t3, n2) {
              var r2;
              return String(null !== (r2 = e2[n2]) && void 0 !== r2 ? r2 : "");
            });
          };
        }
        function I(t2, e2) {
          var n2 = k(t2), r2 = k(e2);
          return function(t3) {
            var e3 = t3[0], i2 = t3[1], o2 = i2.id, u2 = C('<span class="littlefoot">' + n2(i2) + "</span>"), c2 = u2.firstElementChild;
            c2.setAttribute("aria-expanded", "false"), c2.dataset.footnoteButton = "", c2.dataset.footnoteId = o2;
            var a2 = C(r2(i2));
            a2.dataset.footnotePopover = "", a2.dataset.footnoteId = o2;
            var l2 = L(a2, _), s2 = L(a2, T);
            return function(t4, e4) {
              t4.addEventListener("wheel", D.throttle(A(e4), 16));
            }(s2, a2), e3.insertAdjacentElement("beforebegin", u2), { id: o2, button: c2, host: u2, popover: a2, content: s2, wrapper: l2 };
          };
        }
        function q(t2) {
          var n2, i2, o2, u2 = t2.allowDuplicates, c2 = t2.anchorParentSelector, a2 = t2.anchorPattern, l2 = t2.buttonTemplate, s2 = t2.contentTemplate, f2 = t2.footnoteSelector, d2 = t2.numberResetSelector, v2 = t2.scope, m2 = function(t3, e2, n3) {
            return W(t3, n3 + ' a[href*="#"]').filter(function(t4) {
              return (t4.href + t4.rel).match(e2);
            });
          }(document, a2, v2).map(/* @__PURE__ */ function(t3, e2, n3, r2) {
            var i3 = [];
            return function(o3) {
              var u3 = o3.href.split("#")[1], c3 = u3 ? W(t3, "#" + window.CSS.escape(u3)).find(function(t4) {
                return e2 || !i3.includes(t4);
              }) : void 0, a3 = null == c3 ? void 0 : c3.closest(r2);
              if (a3) {
                i3.push(a3);
                var l3 = o3.closest(n3) || o3;
                return [l3.id || o3.id, l3, a3];
              }
            };
          }(document, u2, c2, f2)).filter(P).map(z).map(d2 ? (n2 = d2, i2 = 0, o2 = null, function(t3) {
            var r2 = t3[0], u3 = t3[1], c3 = t3[2], a3 = r2.closest(n2);
            return i2 = o2 === a3 ? i2 + 1 : 1, o2 = a3, [r2, u3, e(e({}, c3), { number: i2 })];
          }) : function(t3) {
            return t3;
          }).map(function(t3) {
            var e2 = t3[0], n3 = t3[1], r2 = t3[2];
            return O(e2, n3), j(n3), [e2, r2];
          }).map(I(l2, s2)).map(w);
          return { footnotes: m2, unmount: function() {
            m2.forEach(function(t3) {
              return t3.destroy();
            }), W(document, "." + M).forEach(function(t3) {
              return r(t3, M);
            });
          } };
        }
        var F = "[data-footnote-id]", N = function(t2, e2) {
          return t2.target.closest(e2);
        }, B = function(t2) {
          return null == t2 ? void 0 : t2.dataset.footnoteId;
        }, V = function(t2) {
          return function(e2) {
            e2.preventDefault();
            var n2 = N(e2, F), r2 = B(n2);
            r2 && t2(r2);
          };
        }, U = document.addEventListener, Y = window.addEventListener, $ = function(t2, e2, n2, r2) {
          return U(t2, function(t3) {
            var r3 = t3.target;
            (null == r3 ? void 0 : r3.closest(e2)) && n2.call(r3, t3);
          }, r2);
        };
        var G = { activateDelay: 100, activateOnHover: false, allowDuplicates: true, allowMultiple: false, anchorParentSelector: "sup", anchorPattern: /(fn|footnote|note)[:\-_\d]/gi, dismissDelay: 100, dismissOnUnhover: false, dismissOnDocumentTouch: true, footnoteSelector: "li", hoverDelay: 250, numberResetSelector: "", scope: "", contentTemplate: '<aside class="littlefoot__popover" id="fncontent:<% id %>"><div class="'.concat(_, '"><div class="').concat(T, '"><% content %></div></div><div class="').concat(v, '"></div></aside>'), buttonTemplate: '<button class="littlefoot__button" id="<% reference %>" title="See Footnote <% number %>"><svg role="img" aria-labelledby="title-<% reference %>" viewbox="0 0 31 6" preserveAspectRatio="xMidYMid"><title id="title-<% reference %>">Footnote <% number %></title><circle r="3" cx="3" cy="3" fill="white"></circle><circle r="3" cx="15" cy="3" fill="white"></circle><circle r="3" cx="27" cy="3" fill="white"></circle></svg></button>' };
        function J(t2) {
          void 0 === t2 && (t2 = {});
          var n2 = e(e({}, G), t2), r2 = function(t3, e2) {
            var n3, r3 = t3.footnotes, i3 = t3.unmount, o2 = function(t4) {
              return function(n4) {
                n4.isReady() && (n4.dismiss(e2.dismissCallback), setTimeout(n4.remove, t4));
              };
            }, u2 = function(t4) {
              return function(n4) {
                e2.allowMultiple || r3.filter(function(t5) {
                  return t5.id !== n4.id;
                }).forEach(o2(e2.dismissDelay)), n4.isReady() && (n4.activate(e2.activateCallback), n4.reposition(), n4.resize(), setTimeout(n4.ready, t4));
              };
            }, c2 = function(t4) {
              return function(e3) {
                var n4 = r3.find(function(t5) {
                  return t5.id === e3;
                });
                n4 && t4(n4);
              };
            }, a2 = function() {
              return r3.forEach(o2(e2.dismissDelay));
            };
            return { activate: function(t4, e3) {
              return c2(u2(e3))(t4);
            }, dismiss: function(t4, e3) {
              return c2(o2(e3))(t4);
            }, dismissAll: a2, touchOutside: function() {
              e2.dismissOnDocumentTouch && a2();
            }, repositionAll: function() {
              return r3.forEach(function(t4) {
                return t4.reposition();
              });
            }, resizeAll: function() {
              return r3.forEach(function(t4) {
                return t4.resize();
              });
            }, toggle: c2(function(t4) {
              return t4.isActive() ? o2(e2.dismissDelay)(t4) : u2(e2.activateDelay)(t4);
            }), hover: c2(function(t4) {
              n3 = t4.id, e2.activateOnHover && !t4.isActive() && u2(e2.hoverDelay)(t4);
            }), unhover: c2(function(t4) {
              t4.id === n3 && (n3 = null), e2.dismissOnUnhover && setTimeout(function() {
                return r3.filter(function(t5) {
                  return t5.id !== n3;
                }).forEach(o2(e2.dismissDelay));
              }, e2.hoverDelay);
            }), unmount: i3 };
          }(q(n2), n2), i2 = function(t3) {
            var e2 = function(e3) {
              var n4 = N(e3, "[data-footnote-button]"), r4 = B(n4);
              r4 ? (e3.preventDefault(), t3.toggle(r4)) : N(e3, "[data-footnote-popover]") || t3.touchOutside();
            }, n3 = D.throttle(t3.repositionAll, 16), r3 = D.throttle(t3.resizeAll, 16), i3 = V(t3.hover), o2 = V(t3.unhover), u2 = new AbortController(), c2 = { signal: u2.signal };
            return U("touchend", e2, c2), U("click", e2, c2), U("keyup", function(e3) {
              27 !== e3.keyCode && "Escape" !== e3.key && "Esc" !== e3.key || t3.dismissAll();
            }, c2), U("gestureend", n3, c2), Y("scroll", n3, c2), Y("resize", r3, c2), $("mouseover", F, i3, c2), $("mouseout", F, o2, c2), function() {
              u2.abort();
            };
          }(r2);
          return { activate: function(t3, e2) {
            void 0 === e2 && (e2 = n2.activateDelay), r2.activate(t3, e2);
          }, dismiss: function(t3, e2) {
            void 0 === e2 && (e2 = n2.dismissDelay), void 0 === t3 ? r2.dismissAll() : r2.dismiss(t3, e2);
          }, unmount: function() {
            i2(), r2.unmount();
          }, getSetting: function(t3) {
            return n2[t3];
          }, updateSetting: function(t3, e2) {
            n2[t3] = e2;
          } };
        }
        t.default = J, t.littlefoot = J, Object.defineProperty(t, "__esModule", { value: true });
      });
    }
  });

  // <stdin>
  var { littlefoot } = require_littlefoot();
  littlefoot();
  var mobileMenuButton = document.getElementById("mobile-menu-button");
  var mobileMenu = document.getElementById("mobile-menu");
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
})();
