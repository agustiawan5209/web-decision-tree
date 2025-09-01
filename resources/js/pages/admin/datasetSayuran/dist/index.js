"use strict";
exports.__esModule = true;
var delete_confirmation_form_1 = require("@/components/delete-confirmation-form");
var pagination_table_1 = require("@/components/pagination-table");
var button_1 = require("@/components/ui/button");
var select_1 = require("@/components/ui/select");
var table_1 = require("@/components/ui/table");
var app_layout_1 = require("@/layouts/app-layout");
var react_1 = require("@inertiajs/react");
var lucide_react_1 = require("lucide-react");
var react_2 = require("react");
function DatasetSayuranIndex(_a) {
    var _b, _c, _d, _e, _f;
    var datasetSayuran = _a.datasetSayuran, breadcrumb = _a.breadcrumb, filter = _a.filter, can = _a.can;
    // Memoize breadcrumbs to prevent unnecessary recalculations
    var breadcrumbs = react_2.useMemo(function () { return (breadcrumb ? breadcrumb.map(function (item) { return ({ title: item.title, href: item.href }); }) : []); }, [breadcrumb]);
    var _g = react_1.useForm({
    // q: '',
    // per_page: '',
    // order_by: '',
    }), data = _g.data, setData = _g.setData, get = _g.get, processing = _g.processing, errors = _g.errors, reset = _g.reset;
    /** START SEARCH */
    // store search query in state
    var _h = react_2.useState((_b = filter === null || filter === void 0 ? void 0 : filter.q) !== null && _b !== void 0 ? _b : ''), search = _h[0], setSearch = _h[1];
    var submitSearch = function (e) {
        e.preventDefault();
        // clean search query
        var cleanedSearch = search.trim();
        if (cleanedSearch.length > 0) {
            // if search query is not empty, make request to server
            get(route('admin.datasetSayuran.index', { q: cleanedSearch, per_page: filter === null || filter === void 0 ? void 0 : filter.per_page, order_by: filter === null || filter === void 0 ? void 0 : filter.order_by }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: function () { }
            });
        }
    };
    // clear search query when form is submitted
    var clearSearch = function (e) {
        e.preventDefault();
        setSearch('');
        reset();
        // make request to server when search query is cleared
        get(route('admin.datasetSayuran.index'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: function () { }
        });
    };
    /** END SEARCH */
    /** Start Order BY (ASC, DESC) */
    var _j = react_2.useState((_c = filter === null || filter === void 0 ? void 0 : filter.order_by) !== null && _c !== void 0 ? _c : ''), orderBy = _j[0], setOrderBy = _j[1];
    react_2.useEffect(function () {
        // clean search query
        var cleanedOrderBy = orderBy.trim();
        if (cleanedOrderBy.length > 0) {
            // if search query is not empty, make request to server
            get(route('admin.datasetSayuran.index', { order_by: cleanedOrderBy, per_page: filter === null || filter === void 0 ? void 0 : filter.per_page, q: filter === null || filter === void 0 ? void 0 : filter.q }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: function () { }
            });
        }
    }, [orderBy]);
    /** END Order BY */
    var _k = react_2.useState(false), isDeleteDialog = _k[0], setisDeleteDialog = _k[1];
    /** Start Request Per_page */
    var _l = react_2.useState((_d = filter === null || filter === void 0 ? void 0 : filter.per_page) !== null && _d !== void 0 ? _d : 10), perPage = _l[0], setPerPage = _l[1]; // Default value lebih baik angka
    var submitPerPage = function (e) {
        e.preventDefault();
        var cleanedPerPage = perPage.toString().trim();
        var numericPerPage = parseInt(cleanedPerPage);
        // Validasi nilai per_page
        if (!isNaN(numericPerPage) && numericPerPage > 0) {
            get(route('admin.datasetSayuran.index', {
                per_page: numericPerPage
            }), {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }
    };
    /** END Request Per_page */
    console.log('datasetSayuran', datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.data);
    return (React.createElement(app_layout_1["default"], { breadcrumbs: breadcrumbs },
        React.createElement(react_1.Head, { title: "DatasetSayuran" }),
        React.createElement("div", { className: "dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4" },
            React.createElement("div", { className: "relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border" },
                React.createElement("div", { className: "flex w-full flex-1 flex-row items-end justify-end gap-7 px-1 py-1 md:items-center md:justify-between lg:px-4 lg:py-2" },
                    React.createElement("div", { className: "flex w-full flex-1 flex-col gap-7 px-1 py-1 md:flex-row md:items-center lg:px-4 lg:py-2" }, can.add && (React.createElement(react_1.Link, { href: route('admin.datasetSayuran.create'), className: "col-span-1 cursor-pointer" },
                        React.createElement(button_1.Button, { variant: "default", className: "flex cursor-pointer items-center gap-2 bg-primary" }, "Tambah Data"))))),
                React.createElement("div", { className: "overflow-hidden lg:w-full" },
                    React.createElement(table_1.Table, { className: "w-full" },
                        React.createElement(table_1.TableHeader, null,
                            React.createElement(table_1.TableRow, null,
                                React.createElement(table_1.TableHead, { className: "w-10" }, "No."),
                                React.createElement(table_1.TableHead, null, "Nama Sayuran"),
                                React.createElement(table_1.TableHead, null, "Nutrisi"),
                                React.createElement(table_1.TableHead, null, "Manfaat"),
                                React.createElement(table_1.TableHead, null, "Status Nutrisi"),
                                React.createElement(table_1.TableHead, null, "Gejala"),
                                React.createElement(table_1.TableHead, null, "Aksi"))),
                        React.createElement(table_1.TableBody, { className: processing ? 'opacity-50' : '' }, ((_e = datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.data) === null || _e === void 0 ? void 0 : _e.length) > 0 && (datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.data.map(function (item, index) { return (React.createElement(table_1.TableRow, { key: index },
                            React.createElement(table_1.TableCell, null, index + 1 + ((datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.current_page) - 1) * (datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.per_page)),
                            React.createElement(table_1.TableCell, null,
                                " ",
                                item.nama_sayuran,
                                " "),
                            React.createElement(table_1.TableCell, null,
                                " ",
                                item.nutrisi,
                                " "),
                            React.createElement(table_1.TableCell, null,
                                " ",
                                item.manfaat,
                                " "),
                            React.createElement(table_1.TableCell, null,
                                " ",
                                item.status,
                                " "),
                            React.createElement(table_1.TableCell, null,
                                " ",
                                item.gejala,
                                " "),
                            React.createElement(table_1.TableCell, null,
                                React.createElement("div", { className: "flex flex-row items-center gap-2" },
                                    React.createElement(delete_confirmation_form_1.DeleteConfirmationForm, { title: "Hapus datasetSayuran " + item.id, id: item.id, url: route('admin.datasetSayuran.destroy', { datasetSayuran: item.id }), setOpenDialog: setisDeleteDialog }),
                                    React.createElement(react_1.Link, { href: route('admin.datasetSayuran.edit', { datasetSayuran: item.id }) },
                                        React.createElement(button_1.Button, { variant: 'default', type: "button", className: "bg-chart-4" },
                                            React.createElement(lucide_react_1.PenBoxIcon, { size: 4 }))))))); })))),
                    React.createElement("div", { className: "flex flex-col items-center justify-between gap-7 border-x-2 border-b-2 p-2 md:flex-row" },
                        React.createElement("div", { className: "flex items-center gap-7 px-1 py-1 lg:px-4 lg:py-2" },
                            React.createElement("div", { className: "flex flex-row gap-2" },
                                React.createElement(select_1.Select, { defaultValue: "10", value: perPage, onValueChange: function (e) { return setPerPage(e.toString()); } },
                                    React.createElement(select_1.SelectTrigger, null,
                                        React.createElement(select_1.SelectValue, { placeholder: "Jumlah Data" })),
                                    React.createElement(select_1.SelectContent, null,
                                        React.createElement(select_1.SelectGroup, null,
                                            React.createElement(select_1.SelectItem, { value: "10" }, "10"),
                                            React.createElement(select_1.SelectItem, { value: "20" }, "20"),
                                            React.createElement(select_1.SelectItem, { value: "50" }, "50"),
                                            React.createElement(select_1.SelectItem, { value: "100" }, "100")))),
                                React.createElement(button_1.Button, { variant: "outline", type: "button", onClick: submitPerPage, className: "flex items-center gap-2 text-xs" }, "Tampilkan")),
                            React.createElement("div", { className: "text-xs text-gray-600" },
                                ' ',
                                "halaman ", datasetSayuran === null || datasetSayuran === void 0 ? void 0 :
                                datasetSayuran.from,
                                " ke ", datasetSayuran === null || datasetSayuran === void 0 ? void 0 :
                                datasetSayuran.to,
                                " dari ", datasetSayuran === null || datasetSayuran === void 0 ? void 0 :
                                datasetSayuran.total,
                                " total")),
                        React.createElement(pagination_table_1["default"], { links: (_f = datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.links) !== null && _f !== void 0 ? _f : [], data: filter })))))));
}
exports["default"] = DatasetSayuranIndex;
