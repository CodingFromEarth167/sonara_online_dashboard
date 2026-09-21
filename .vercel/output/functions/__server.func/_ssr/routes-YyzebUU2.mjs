import { t as cn } from "./utils-C_uf36nf.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as intensityFromSpl, i as STATIONS, n as BOARD_LABEL, o as useSonara, r as KIND_LABEL, t as AppShell } from "./app-shell-DkFbPiZx.mjs";
import { t as Button } from "./button-DdKF2zOF.mjs";
import { t as Badge } from "./badge-BEw4wgwS.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
import { i as TooltipTrigger, n as Tooltip, r as TooltipContent } from "./router-lrZ2RYG6.mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root } from "../_libs/radix-ui__react-scroll-area.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-YyzebUU2.js
var import_jsx_runtime = require_jsx_runtime();
function ScrollArea({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
		className: cn("relative overflow-hidden", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
			orientation: "vertical",
			className: "flex w-2.5 touch-none p-px select-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-border" })
		})]
	});
}
function kindVariant(kind) {
	if (kind === "quiet") return "quiet";
	if (kind === "wildlife") return "quiet";
	if (kind === "engine" || kind === "impact" || kind === "congestion") return "heat";
	return "muted";
}
function EventFeed({ events, onSelect }) {
	if (events.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-1 py-8 text-sm text-muted",
		children: "No anomaly events yet. Turn on Listen, or wait for a field spike."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
		className: "h-[min(52vh,28rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col",
			children: events.map((e) => {
				const station = STATIONS.find((s) => s.id === e.stationId);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onSelect(e.stationId),
					className: "flex w-full items-start justify-between gap-3 rounded-sm px-1 py-3 text-left transition-colors duration-[var(--motion-quick)] hover:bg-surface-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-fg",
							children: station?.name ?? e.stationId
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: formatDistanceToNow(e.ts, { addSuffix: true })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-end gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm tabular-nums",
							children: [Math.round(e.spl), " dB"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: kindVariant(e.kind),
							children: KIND_LABEL[e.kind]
						})]
					})]
				}) }, e.id);
			})
		})
	});
}
function HourStrip({ values, label }) {
	const hour = (/* @__PURE__ */ new Date()).getHours();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.16em] text-muted uppercase",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "24 hours"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-24 gap-px",
			children: values.map((spl, i) => {
				const t = intensityFromSpl(spl);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					title: `${i}:00 · ${Math.round(spl)} dB`,
					className: cn("h-10 rounded-xs", i === hour ? "ring-1 ring-accent" : ""),
					style: {
						backgroundColor: `color-mix(in oklab, var(--color-heat) ${Math.round(t * 88)}%, var(--color-quiet))`,
						opacity: .35 + t * .65
					}
				}, i);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-1 flex justify-between text-[10px] tracking-wide text-subtle uppercase",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "00" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "06" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "12" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "18" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "24" })
			]
		})
	] });
}
function Separator({ className, orientation = "horizontal", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "separator",
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
		...props
	});
}
function NodePanel({ station }) {
	const hot = station.liveDb - station.baselineDb >= 10;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.16em] text-muted uppercase",
				children: "Selected node"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-2xl font-medium",
				children: station.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: station.place
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-5xl leading-none font-medium tabular-nums",
					children: Math.round(station.liveDb)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs tracking-wide text-muted uppercase",
					children: "dB SPL"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: hot ? "heat" : "quiet",
					children: KIND_LABEL[station.kindNow]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: "Baseline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "tabular-nums",
						children: [Math.round(station.baselineDb), " dB"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: "Board"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: BOARD_LABEL[station.board] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: "Link"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: station.online ? "Online" : "Standby" })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: "Mic pin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "tabular-nums",
						children: "GPIO 32"
					})] })
				]
			})
		]
	});
}
function NoiseMap({ stations, selectedId, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/city-basemap.jpg",
				alt: "Aerial dusk view of the mapped neighborhood",
				className: "aspect-video w-full object-cover",
				crossOrigin: "anonymous"
			}),
			stations.map((s) => {
				const t = intensityFromSpl(s.liveDb);
				const size = 16 + t * 22;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": "true",
					className: "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen",
					style: {
						left: `${s.x}%`,
						top: `${s.y}%`,
						width: `${size}%`,
						aspectRatio: "1",
						opacity: .28 + t * .55,
						background: "radial-gradient(circle, color-mix(in oklab, var(--color-heat) 75%, transparent) 0%, color-mix(in oklab, var(--color-quiet) 45%, transparent) 46%, transparent 72%)"
					}
				}, `${s.id}-heat`);
			}),
			stations.map((s) => {
				const hot = s.liveDb - s.baselineDb >= 10;
				const selected = s.id === selectedId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSelect(s.id),
						style: {
							left: `${s.x}%`,
							top: `${s.y}%`
						},
						className: cn("absolute z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full", selected ? "z-20" : ""),
						"aria-label": `${s.name}, ${Math.round(s.liveDb)} decibels`,
						children: [hot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "sonara-pulse absolute size-10 rounded-full bg-heat/30" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("relative block size-3 rounded-full", hot ? "bg-heat" : "bg-quiet", selected ? "size-3.5 ring-2 ring-accent ring-offset-2 ring-offset-bg" : "", !s.online ? "bg-muted" : "") })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: s.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								Math.round(s.liveDb),
								" dB · ",
								KIND_LABEL[s.kindNow]
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: BOARD_LABEL[s.board]
						})
					]
				}) })] }, s.id);
			})
		]
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-surface-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-fg shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60" })]
	});
}
function Field() {
	const stations = useSonara((s) => s.stations);
	const events = useSonara((s) => s.events);
	const selectedId = useSonara((s) => s.selectedId);
	const select = useSonara((s) => s.select);
	const hourHeat = useSonara((s) => s.hourHeat);
	const calibration = useSonara((s) => s.calibration);
	const thresholdDb = useSonara((s) => s.thresholdDb);
	const setCalibration = useSonara((s) => s.setCalibration);
	const setThreshold = useSonara((s) => s.setThreshold);
	const replayDemo = useSonara((s) => s.replayDemo);
	const listening = useSonara((s) => s.listening);
	const micError = useSonara((s) => s.micError);
	const selected = stations.find((s) => s.id === selectedId) ?? stations[0];
	const heat = hourHeat[selected.id] ?? Array(24).fill(selected.baselineDb);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex min-w-0 flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted uppercase",
						children: "24-hour noise heatmap"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-medium sm:text-4xl",
						children: "Listen to the neighborhood"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted",
						children: "Six field nodes plus this browser sample ambient sound. Spikes — engine roar, congestion, wildlife calls — are flagged as anomalies and painted on the map."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoiseMap, {
					stations,
					selectedId,
					onSelect: select
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HourStrip, {
						values: heat,
						label: selected.name
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodePanel, { station: selected }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.16em] text-muted uppercase",
							children: "Detector"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex justify-between text-xs text-muted",
										children: ["Calibration", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums text-fg",
											children: [calibration, " dB"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										className: "mt-3",
										min: 70,
										max: 110,
										step: 1,
										value: [calibration],
										onValueChange: (v) => setCalibration(v[0] ?? 94)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex justify-between text-xs text-muted",
										children: ["Anomaly threshold", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums text-fg",
											children: [
												"+",
												thresholdDb,
												" dB"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										className: "mt-3",
										min: 6,
										max: 24,
										step: 1,
										value: [thresholdDb],
										onValueChange: (v) => setThreshold(v[0] ?? 12)
									})]
								}),
								listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-quiet",
									children: "Live microphone is the “This device” node."
								}) : null,
								micError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-heat",
									children: micError
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => replayDemo("engine"),
									children: "Replay roar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => replayDemo("wildlife"),
									children: "Replay wildlife"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => replayDemo("impact"),
									children: "Replay burst"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.16em] text-muted uppercase",
						children: "Anomaly log"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventFeed, {
						events: events.slice(0, 18),
						onSelect: select
					})]
				})
			]
		})]
	}) });
}
//#endregion
export { Field as component };
