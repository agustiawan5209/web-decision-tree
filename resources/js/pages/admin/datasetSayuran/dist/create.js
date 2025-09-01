"use strict";
exports.__esModule = true;
var input_error_1 = require("@/components/input-error");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var app_layout_1 = require("@/layouts/app-layout");
var react_1 = require("@inertiajs/react");
var lucide_react_1 = require("lucide-react");
var react_2 = require("react");
var react_select_1 = require("react-select");
var animated_1 = require("react-select/animated");
function DatasetSayuranCreate(_a) {
    var _b, _c, _d, _e;
    var breadcrumb = _a.breadcrumb, gejala = _a.gejala, label = _a.label, datasetSayuran = _a.datasetSayuran;
    // Memoize breadcrumbs to prevent unnecessary recalculations
    var breadcrumbs = react_2.useMemo(function () { return (breadcrumb ? breadcrumb.map(function (item) { return ({ title: item.title, href: item.href }); }) : []); }, [breadcrumb]);
    // Parse gejala from string to array if datasetSayuran exists
    var initialGejala = react_2.useMemo(function () {
        if (datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.gejala) {
            if (typeof datasetSayuran.gejala === 'string') {
                try {
                    return JSON.parse(datasetSayuran.gejala);
                }
                catch (e) {
                    return datasetSayuran.gejala.split(',').map(function (item) { return item.trim(); });
                }
            }
            return datasetSayuran.gejala;
        }
        return [];
    }, [datasetSayuran]);
    var initialLabel = react_2.useMemo(function () {
        if (datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.status) {
            if (typeof datasetSayuran.status === 'string') {
                try {
                    return JSON.parse(datasetSayuran.status);
                }
                catch (e) {
                    return datasetSayuran.status.split(',').map(function (item) { return item.trim(); });
                }
            }
            return datasetSayuran.status;
        }
        return [];
    }, [datasetSayuran]);
    var _f = react_2.useState(initialGejala), inputGejala = _f[0], setInputGejala = _f[1];
    var _g = react_2.useState(initialLabel), inputLabel = _g[0], setInputLabel = _g[1];
    var _h = react_1.useForm({
        id: (_b = datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.id) !== null && _b !== void 0 ? _b : 0,
        nama_sayuran: (_c = datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.nama_sayuran) !== null && _c !== void 0 ? _c : '',
        nutrisi: (_d = datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.nutrisi) !== null && _d !== void 0 ? _d : '',
        manfaat: (_e = datasetSayuran === null || datasetSayuran === void 0 ? void 0 : datasetSayuran.manfaat) !== null && _e !== void 0 ? _e : '',
        status: '',
        gejala: ''
    }), data = _h.data, setData = _h.setData, post = _h.post, processing = _h.processing, errors = _h.errors, reset = _h.reset;
    // Update form data when inputGejala or inputLabel changes
    react_2.useEffect(function () {
        setData('gejala', inputGejala.join(', '));
        setData('status', inputLabel.join(', '));
    }, [inputGejala, inputLabel, setData]);
    /**
     * Handles the form submission. Prevents the default form submission,
     * then makes a POST request to the server to store the new DatasetSayuran.
     * If there's an error, logs the error to the console.
     */
    var submit = function (e) {
        e.preventDefault();
        post(route('admin.datasetSayuran.store'), {
            onError: function (err) { return console.log(err); }
        });
    };
    // Prepare options for react-select
    var options = react_2.useMemo(function () { return gejala.map(function (item) { return ({ value: item.nama, label: item.nama }); }); }, [gejala]);
    var optionsLabel = react_2.useMemo(function () { return label.map(function (item) { return ({ value: item.nama, label: item.nama }); }); }, [label]);
    // Get selected values for react-select
    var selectedValues = react_2.useMemo(function () { return options.filter(function (option) { return inputGejala.includes(option.value); }); }, [options, inputGejala]);
    var selectedLabel = react_2.useMemo(function () { return optionsLabel.filter(function (option) { return inputLabel.includes(option.value); }); }, [optionsLabel, inputLabel]);
    var animatedComponents = animated_1["default"]();
    // Handle select change
    var handleGejalaChange = function (selectedOptions) {
        var selectedValues = selectedOptions ? selectedOptions.map(function (option) { return option.value; }) : [];
        setInputGejala(selectedValues);
    };
    var handleStatusChange = function (selectedOptions) {
        var selectedLabel = selectedOptions ? selectedOptions.map(function (option) { return option.value; }) : [];
        setInputLabel(selectedLabel);
    };
    return (React.createElement(app_layout_1["default"], { breadcrumbs: breadcrumbs },
        React.createElement(react_1.Head, { title: datasetSayuran ? 'Edit Dataset Sayuran' : 'Tambah Dataset Sayuran' }),
        React.createElement("div", { className: "dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4" },
            React.createElement("div", { className: "relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border" },
                React.createElement("div", { className: "p-4 md:p-6" },
                    React.createElement("form", { className: "flex flex-col gap-6", onSubmit: submit },
                        React.createElement("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2" },
                            React.createElement("div", { className: "grid gap-4" },
                                React.createElement("div", { className: "grid gap-2" },
                                    React.createElement(label_1.Label, { htmlFor: "nama_sayuran" }, "Nama Sayuran"),
                                    React.createElement(input_1.Input, { id: "nama_sayuran", type: "text", required: true, autoFocus: true, tabIndex: 1, autoComplete: "nama_sayuran", value: data.nama_sayuran, onChange: function (e) { return setData('nama_sayuran', e.target.value); }, disabled: processing, placeholder: "Nama Sayuran" }),
                                    React.createElement(input_error_1["default"], { message: errors.nama_sayuran, className: "mt-2" })),
                                React.createElement("div", { className: "grid gap-2" },
                                    React.createElement(label_1.Label, { htmlFor: "nutrisi" }, "Nutrisi Buah"),
                                    React.createElement(input_1.Input, { id: "nutrisi", type: "text", required: true, tabIndex: 2, autoComplete: "nutrisi", value: data.nutrisi, onChange: function (e) { return setData('nutrisi', e.target.value); }, disabled: processing, placeholder: "Nutrisi pada buah" }),
                                    React.createElement(input_error_1["default"], { message: errors.nutrisi, className: "mt-2" })),
                                React.createElement("div", { className: "grid gap-2" },
                                    React.createElement(label_1.Label, { htmlFor: "manfaat" }, "Manfaat"),
                                    React.createElement(input_1.Input, { id: "manfaat", type: "text", required: true, tabIndex: 3, autoComplete: "manfaat", value: data.manfaat, onChange: function (e) { return setData('manfaat', e.target.value); }, disabled: processing, placeholder: "Manfaat sayuran" }),
                                    React.createElement(input_error_1["default"], { message: errors.manfaat }))),
                            React.createElement("div", { className: "grid gap-4" },
                                React.createElement("div", { className: "grid gap-2" },
                                    React.createElement(label_1.Label, { htmlFor: "gejala" }, "Gejala"),
                                    React.createElement(react_select_1["default"], { id: "gejala", name: "gejala", value: selectedValues, onChange: handleGejalaChange, closeMenuOnSelect: false, components: animatedComponents, isMulti: true, options: options, isDisabled: processing, className: "react-select-container", classNamePrefix: "react-select", tabIndex: 4, placeholder: "Pilih gejala..." }),
                                    React.createElement(input_error_1["default"], { message: errors.gejala })),
                                React.createElement("div", { className: "grid gap-2" },
                                    React.createElement(label_1.Label, { htmlFor: "status" }, "Status Nutrisi"),
                                    React.createElement(react_select_1["default"], { id: "status", name: "status", value: selectedLabel, onChange: handleStatusChange, closeMenuOnSelect: false, components: animatedComponents, isMulti: true, options: optionsLabel, isDisabled: processing, className: "react-select-container", classNamePrefix: "react-select", tabIndex: 5, placeholder: "Pilih status nutrisi..." }),
                                    React.createElement(input_error_1["default"], { message: errors.status }))),
                            React.createElement("div", { className: "md:col-span-2" },
                                React.createElement(button_1.Button, { type: "submit", variant: 'default', className: "mt-2 w-full", tabIndex: 6, disabled: processing },
                                    processing && React.createElement(lucide_react_1.LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                                    datasetSayuran ? 'Update' : 'Simpan')))))))));
}
exports["default"] = DatasetSayuranCreate;
