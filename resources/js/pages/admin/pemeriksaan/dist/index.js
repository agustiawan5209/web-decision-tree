"use strict";
exports.__esModule = true;
var collapsible_table_1 = require("@/components/collapsible-table");
var detail_pemeriksaan_1 = require("@/components/detail-pemeriksaan");
var pagination_table_1 = require("@/components/pagination-table");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var select_1 = require("@/components/ui/select");
var table_1 = require("@/components/ui/table");
var app_layout_1 = require("@/layouts/app-layout");
var react_1 = require("@inertiajs/react");
var react_2 = require("react");
function PemeriksaanIndex(_a) {
    var _b, _c, _d, _e, _f;
    var pemeriksaan = _a.pemeriksaan, breadcrumb = _a.breadcrumb, filter = _a.filter, statusLabel = _a.statusLabel, can = _a.can;
    // Memoize breadcrumbs to prevent unnecessary recalculations
    var breadcrumbs = react_2.useMemo(function () { return (breadcrumb ? breadcrumb.map(function (item) { return ({ title: item.title, href: item.href }); }) : []); }, [breadcrumb]);
    var _g = react_1.useForm(), get = _g.get, processing = _g.processing;
    // State management
    var _h = react_2.useState((_b = filter === null || filter === void 0 ? void 0 : filter.q) !== null && _b !== void 0 ? _b : ''), search = _h[0], setSearch = _h[1];
    var _j = react_2.useState((_c = filter === null || filter === void 0 ? void 0 : filter.date) !== null && _c !== void 0 ? _c : ''), TglPemeriksaan = _j[0], setTglPemeriksaan = _j[1];
    var _k = react_2.useState((_d = filter === null || filter === void 0 ? void 0 : filter.order_by) !== null && _d !== void 0 ? _d : ''), orderBy = _k[0], setOrderBy = _k[1];
    var _l = react_2.useState((_e = filter === null || filter === void 0 ? void 0 : filter.per_page) !== null && _e !== void 0 ? _e : '10'), perPage = _l[0], setPerPage = _l[1];
    var _m = react_2.useState(false), dialogOpen = _m[0], setDialogOpen = _m[1];
    // Memoized route parameters to avoid recalculations
    var routeParams = react_2.useMemo(function () { return ({
        q: search.trim(),
        per_page: perPage,
        order_by: orderBy,
        date: TglPemeriksaan
    }); }, [search, perPage, orderBy, TglPemeriksaan]);
    // Optimized filter submission using useCallback
    var submitFilter = react_2.useCallback(function () {
        var cleanedSearch = search.trim();
        var cleanedDate = TglPemeriksaan.trim();
        var numericPerPage = parseInt(perPage.toString());
        // Only make request if there are valid changes
        if (cleanedSearch || cleanedDate || !isNaN(numericPerPage)) {
            get(route('pemeriksaan.index', routeParams), {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }
    }, [get, routeParams]);
    // Handle search submission
    var submitSearch = react_2.useCallback(function (e) {
        e.preventDefault();
        submitFilter();
    }, [submitFilter]);
    // Handle per page submission
    var submitPerPage = react_2.useCallback(function (e) {
        e.preventDefault();
        submitFilter();
    }, [submitFilter]);
    // Handle date submission
    var submitTglPemeriksaan = react_2.useCallback(function () {
        submitFilter();
    }, [submitFilter]);
    // Clear all filters
    var clearSearch = react_2.useCallback(function (e) {
        e.preventDefault();
        setSearch('');
        setTglPemeriksaan('');
        setPerPage('10');
        setOrderBy('');
        get(route('pemeriksaan.index'), {
            preserveState: true,
            preserveScroll: true
        });
    }, [get]);
    // Effect for orderBy changes
    react_2.useEffect(function () {
        var cleanedOrderBy = orderBy.trim();
        if (cleanedOrderBy) {
            get(route('pemeriksaan.index', {
                order_by: cleanedOrderBy,
                per_page: perPage,
                q: search
            }), {
                preserveState: true,
                preserveScroll: true
            });
        }
    }, [orderBy, get, perPage, search]);
    // Memoize table rows to prevent unnecessary re-renders
    var tableRows = react_2.useMemo(function () {
        var _a;
        if (!((_a = pemeriksaan === null || pemeriksaan === void 0 ? void 0 : pemeriksaan.data) === null || _a === void 0 ? void 0 : _a.length))
            return null;
        return pemeriksaan.data.map(function (item, index) {
            var read_url = null;
            read_url = route('pemeriksaan.show', { pemeriksaan: item.id });
            var delete_url = null;
            if (can["delete"]) {
                delete_url = route('pemeriksaan.destroy', { pemeriksaan: item.id });
            }
            return (React.createElement(collapsible_table_1["default"], { key: item.id, num: index + 1 + (pemeriksaan.current_page - 1) * pemeriksaan.per_page, title: item.rme, columnData: [
                    item.tgl_pemeriksaan,
                    item.balita.nama,
                    item.balita.orangtua.name,
                    item.balita.tempat_lahir + "/" + item.balita.tanggal_lahir,
                    item.label,
                ], "delete": "delete", url: delete_url !== null && delete_url !== void 0 ? delete_url : '', id: item.id.toString(), show: read_url !== null && read_url !== void 0 ? read_url : '' },
                React.createElement(detail_pemeriksaan_1["default"], { pemeriksaan: item, detail: item.detailpemeriksaan })));
        });
    }, [pemeriksaan]);
    return (React.createElement(app_layout_1["default"], { breadcrumbs: breadcrumbs },
        React.createElement(react_1.Head, { title: "Pemeriksaan" }),
        React.createElement("div", { className: "dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4" },
            React.createElement("div", { className: "relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border" },
                React.createElement("div", { className: "flex w-full flex-1 flex-col items-start justify-start gap-4 md:gap-7 lg:flex-row lg:items-center lg:justify-between lg:px-4 lg:py-2" },
                    React.createElement("div", { className: "flex w-full flex-1 flex-wrap gap-7 md:items-start lg:flex-row lg:px-4 lg:py-2" },
                        can.add && (React.createElement(react_1.Link, { href: route('pemeriksaan.create-id') },
                            React.createElement(button_1.Button, { type: "button", size: "lg", tabIndex: 4, className: "flex cursor-pointer items-center gap-2 bg-primary" }, "Pemeriksaan Nutrisi"))),
                        React.createElement("div", { className: "col-span-full flex flex-wrap items-center gap-2 lg:col-span-2" },
                            React.createElement("label", { htmlFor: "search", className: "sr-only" }, "Cari"),
                            React.createElement(input_1.Input, { type: "search", id: "search-text", value: search, className: "max-w-max", onChange: function (e) { return setSearch(e.target.value); }, placeholder: "Cari berdasarkan nama/NIK" }),
                            React.createElement(input_1.Input, { type: "date", id: "search-date", value: TglPemeriksaan, onChange: function (e) { return setTglPemeriksaan(e.target.value); }, className: "max-w-fit", placeholder: "Cari berdasarkan tanggal" }),
                            React.createElement(button_1.Button, { variant: "outline", type: "button", onClick: submitSearch, className: "flex items-center gap-2 text-xs", disabled: processing }, "Cari"),
                            React.createElement(button_1.Button, { variant: "outline", type: "button", onClick: clearSearch, className: "flex items-center gap-2 border-red-500 text-xs", disabled: processing }, "Clear"))),
                    React.createElement("div", { className: "col-span-1 lg:px-4 lg:py-2" },
                        React.createElement(select_1.Select, { value: orderBy, onValueChange: setOrderBy },
                            React.createElement(select_1.SelectTrigger, null,
                                React.createElement(select_1.SelectValue, { placeholder: "Tampilan Status" })),
                            React.createElement(select_1.SelectContent, null,
                                React.createElement(select_1.SelectGroup, null,
                                    React.createElement(select_1.SelectLabel, null, "Urutkan"),
                                    React.createElement(select_1.SelectItem, { value: "desc" }, "Terbaru"),
                                    React.createElement(select_1.SelectItem, { value: "asc" }, "Terlama")),
                                React.createElement(select_1.SelectGroup, null,
                                    React.createElement(select_1.SelectLabel, null, "berdasarkan Nutrisi"),
                                    statusLabel.map(function (item) { return (React.createElement(select_1.SelectItem, { key: item, value: item }, item)); })))))),
                React.createElement("div", { className: "overflow-hidden lg:w-full" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "max-w-[300px] md:max-w-[768px] lg:max-w-full" },
                            React.createElement(table_1.Table, { className: "w-full" },
                                React.createElement(table_1.TableHeader, null,
                                    React.createElement(table_1.TableRow, null,
                                        React.createElement(table_1.TableHead, { className: "w-10" }, "No."),
                                        React.createElement(table_1.TableHead, null, "No. RME"),
                                        React.createElement(table_1.TableHead, null, "Tanggal Pemeriksaan"),
                                        React.createElement(table_1.TableHead, null, "Nama Balita/Anak"),
                                        React.createElement(table_1.TableHead, null, "Nama Orang Tua"),
                                        React.createElement(table_1.TableHead, null, "Tempat/Tanggal Lahir"),
                                        React.createElement(table_1.TableHead, null, "Hasil Pemeriksaan Nutrisi"),
                                        React.createElement(table_1.TableHead, null, "Aksi"))),
                                React.createElement(table_1.TableBody, { className: processing ? 'opacity-50' : '' }, tableRows)))),
                    React.createElement("section", { className: "w-full" },
                        React.createElement("div", { className: "flex flex-col items-center justify-between gap-7 border-x-2 border-b-2 p-2 md:flex-row" },
                            React.createElement("div", { className: "flex items-center gap-7 lg:px-4 lg:py-2" },
                                React.createElement("div", { className: "flex flex-row gap-2" },
                                    React.createElement(select_1.Select, { value: perPage, onValueChange: setPerPage },
                                        React.createElement(select_1.SelectTrigger, null,
                                            React.createElement(select_1.SelectValue, { placeholder: "Jumlah Data" })),
                                        React.createElement(select_1.SelectContent, null,
                                            React.createElement(select_1.SelectGroup, null,
                                                React.createElement(select_1.SelectItem, { value: "10" }, "10"),
                                                React.createElement(select_1.SelectItem, { value: "20" }, "20"),
                                                React.createElement(select_1.SelectItem, { value: "50" }, "50"),
                                                React.createElement(select_1.SelectItem, { value: "100" }, "100")))),
                                    React.createElement(button_1.Button, { variant: "outline", type: "button", onClick: submitPerPage, className: "flex items-center gap-2 text-xs", disabled: processing }, "Tampilkan")),
                                React.createElement("div", { className: "text-xs text-gray-600" },
                                    "halaman ", pemeriksaan === null || pemeriksaan === void 0 ? void 0 :
                                    pemeriksaan.from,
                                    " ke ", pemeriksaan === null || pemeriksaan === void 0 ? void 0 :
                                    pemeriksaan.to,
                                    " dari ", pemeriksaan === null || pemeriksaan === void 0 ? void 0 :
                                    pemeriksaan.total,
                                    " total")),
                            React.createElement(pagination_table_1["default"], { links: (_f = pemeriksaan === null || pemeriksaan === void 0 ? void 0 : pemeriksaan.links) !== null && _f !== void 0 ? _f : [], data: filter }))))))));
}
exports["default"] = PemeriksaanIndex;
