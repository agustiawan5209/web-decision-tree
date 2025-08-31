"use strict";
exports.__esModule = true;
var delete_confirmation_form_1 = require("@/components/delete-confirmation-form");
var input_error_1 = require("@/components/input-error");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var table_1 = require("@/components/ui/table");
var app_layout_1 = require("@/layouts/app-layout");
var react_1 = require("@inertiajs/react");
var lucide_react_1 = require("lucide-react");
var react_2 = require("react");
function GejalaIndex(_a) {
    var gejala = _a.gejala, breadcrumb = _a.breadcrumb, titlePage = _a.titlePage, can = _a.can;
    var breadcrumbs = react_2.useMemo(function () { return (breadcrumb ? breadcrumb.map(function (item) { return ({ title: item.title, href: item.href }); }) : []); }, [breadcrumb]);
    var _b = react_1.useForm({
        id: null,
        nama: '',
        deskripsi: ''
    }), data = _b.data, setData = _b.setData, get = _b.get, post = _b.post, put = _b.put, processing = _b.processing, errors = _b.errors;
    var _c = react_2.useState(null), editId = _c[0], setEditId = _c[1];
    var submit = function (e) {
        e.preventDefault();
        if (editId == null) {
            post(route('admin.gejala.store'), {
                preserveState: true,
                onSuccess: function () {
                    setData({
                        id: null,
                        nama: '',
                        deskripsi: ''
                    });
                    setIsOpenDialog(false);
                },
                onError: function (errors) {
                    console.error(errors);
                }
            });
        }
        else {
            put(route('admin.gejala.update', { gejala: editId }), {
                preserveState: true,
                onSuccess: function () {
                    setData({
                        id: null,
                        nama: '',
                        deskripsi: ''
                    });
                    setEditId(null);
                    setIsOpenDialog(false);
                },
                onError: function (errors) {
                    console.error(errors);
                }
            });
        }
    };
    var _d = react_2.useState(false), isOpenDialog = _d[0], setIsOpenDialog = _d[1];
    var handleEdit = function (id) {
        if (id) {
            var gejalaTemp = gejala.filter(function (item) { return item.id === id; }, []);
            setEditId(gejalaTemp[0].id);
            if (gejalaTemp) {
                setData({
                    id: gejalaTemp[0].id,
                    nama: gejalaTemp[0].nama,
                    deskripsi: gejalaTemp[0].deskripsi
                });
            }
            setIsOpenDialog(true);
        }
    };
    var _e = react_2.useState(false), isDeleteDialog = _e[0], setisDeleteDialog = _e[1];
    return (React.createElement(app_layout_1["default"], { breadcrumbs: breadcrumbs },
        React.createElement(react_1.Head, { title: titlePage !== null && titlePage !== void 0 ? titlePage : 'Gejala' }),
        React.createElement(card_1.Card, null,
            React.createElement("div", { className: "container mx-auto px-4" },
                React.createElement("div", { className: "mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" },
                    React.createElement("h2", { className: "text-lg font-bold md:text-xl" }, "Gejala Nutrisi Anak"),
                    React.createElement("div", { className: "flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2" }, (can === null || can === void 0 ? void 0 : can.add) && (React.createElement(button_1.Button, { variant: 'default', type: "button", className: "cursor-pointer", onClick: function () { return setIsOpenDialog(true); } }, "Tambah Data")))),
                React.createElement("div", { className: "overflow-x-auto rounded-sm border" },
                    React.createElement(table_1.Table, { className: "min-w-full" },
                        React.createElement(table_1.TableHeader, null,
                            React.createElement(table_1.TableRow, null,
                                React.createElement(table_1.TableHead, { className: "cursor-pointer" }, "no"),
                                React.createElement(table_1.TableHead, { className: "cursor-pointer" }, "Nama"),
                                ((can === null || can === void 0 ? void 0 : can["delete"]) || (can === null || can === void 0 ? void 0 : can.edit)) && React.createElement(table_1.TableHead, { className: "cursor-pointer" }, "Aksi"))),
                        React.createElement(table_1.TableBody, null, gejala.length > 0 ? (gejala.map(function (item, index) { return (React.createElement(table_1.TableRow, { key: item.id },
                            React.createElement(table_1.TableCell, null, index + 1),
                            React.createElement(table_1.TableCell, null, item.nama),
                            ((can === null || can === void 0 ? void 0 : can.edit) || (can === null || can === void 0 ? void 0 : can["delete"])) && (React.createElement(table_1.TableCell, null,
                                React.createElement("div", { className: "flex flex-row items-center gap-2" },
                                    (can === null || can === void 0 ? void 0 : can.edit) && (React.createElement(button_1.Button, { type: "button", variant: 'default', tooltip: "edit", onClick: function () { return handleEdit(item.id); }, className: "border border-chart-4 bg-chart-4" },
                                        ' ',
                                        React.createElement(lucide_react_1.PenBox, null),
                                        ' ')),
                                    (can === null || can === void 0 ? void 0 : can["delete"]) && (React.createElement(delete_confirmation_form_1.DeleteConfirmationForm, { title: "Hapus gejala " + item.id, id: item.id, url: route('admin.gejala.destroy', { gejala: item.id }), setOpenDialog: setisDeleteDialog }))))))); })) : (React.createElement(table_1.TableRow, null,
                            React.createElement(table_1.TableCell, { colSpan: 4, className: "py-4 text-center" }, "No data found")))))))),
        React.createElement(dialog_1.Dialog, { open: isOpenDialog, onOpenChange: setIsOpenDialog },
            React.createElement(dialog_1.DialogContent, null,
                React.createElement(dialog_1.DialogHeader, null,
                    React.createElement(dialog_1.DialogTitle, null,
                        editId ? "Edit" : "Tambah",
                        " Gejala")),
                React.createElement("form", { className: "space-y-4", onSubmit: submit },
                    React.createElement("div", { className: "grid gap-4" },
                        React.createElement("div", { className: "grid gap-2" },
                            React.createElement(label_1.Label, { htmlFor: "nama", className: "text-sm font-medium" }, "Nama Gejala"),
                            React.createElement(input_1.Input, { type: "text", value: data.nama, onChange: function (e) { return setData('nama', e.target.value); }, id: "nama", name: "nama", className: "input", disabled: processing, placeholder: "Masukkan nama gejala" }),
                            React.createElement(input_error_1["default"], { message: errors.nama, className: "mt-2" }))),
                    React.createElement(dialog_1.DialogFooter, null,
                        React.createElement(button_1.Button, { type: "button", variant: "secondary", onClick: function () { return setIsOpenDialog(false); } }, "Batal"),
                        React.createElement(button_1.Button, { type: "submit" },
                            processing && React.createElement(lucide_react_1.LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                            "Simpan")))))));
}
exports["default"] = GejalaIndex;
