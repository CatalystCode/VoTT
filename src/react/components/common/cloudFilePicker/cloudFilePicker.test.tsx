import { mount } from "enzyme";
import React from "react";
import MockFactory from "../../../../common/mockFactory";
import { StorageProviderFactory } from "../../../../providers/storage/storageProvider";
import { CloudFilePicker, ICloudFilePickerProps, isCloudConnection } from "./cloudFilePicker";

describe("CloudFilePicker", () => {
    function createComponent(props: ICloudFilePickerProps) {
        return mount(<CloudFilePicker {...props}/>);
    }

    function flushPromises() {
        return new Promise((resolve) => setImmediate(resolve));
    }

    const mockFiles = ["file1.json", "file2.json", "file3.json"];

    it("modal is visible", () => {
        const connections = MockFactory.createTestConnections();
        const onCancel = jest.fn();
        const onSubmit = jest.fn();
        const wrapper = createComponent({
            connections,
            isOpen: true,
            onCancel,
            onSubmit,
        });
        expect(wrapper.find("div.modal-content").exists()).toBe(true);
    });

    it("modal is not visible", () => {
        const connections = MockFactory.createTestConnections();
        const onCancel = jest.fn();
        const onSubmit = jest.fn();
        const wrapper = createComponent({
            connections,
            isOpen: false,
            onCancel,
            onSubmit,
        });
        expect(wrapper.find("div.modal-content").exists()).toBe(false);
    });

    it("only shows cloud connections", () => {
        const connections = MockFactory.createTestConnections();
        const onCancel = jest.fn();
        const onSubmit = jest.fn();
        const wrapper = createComponent({
            connections,
            isOpen: true,
            onCancel,
            onSubmit,
        });
        // Half of the connections are cloud connections
        expect(wrapper.find("a")).toHaveLength(connections.length / 2);
    });

    it("sets selected connection", async () => {
        const mockStorageProvider = MockFactory.createStorageProvider(mockFiles);
        StorageProviderFactory.create = jest.fn(() => mockStorageProvider);
        const connections = MockFactory.createTestConnections();
        const onCancel = jest.fn();
        const onSubmit = jest.fn();
        const wrapper = createComponent({
            connections,
            isOpen: true,
            onCancel,
            onSubmit,
        });
        await wrapInPromise(() => wrapper.find("a").first().simulate("click"));
        await flushPromises();
        wrapper.update();

        const state = wrapper.find(CloudFilePicker).state();
        expect(state.backDisabled).toBe(false);
        expect(state.okDisabled).toBe(true);
        expect(state.selectedFile).toBeNull();
        expect(state.modalHeader).toEqual(`Select a file from "Connection 1"`);
        expect(state.selectedConnection).toEqual(connections[0]);
        expect(wrapper.find("a")).toHaveLength(mockFiles.length);
    });

    function wrapInPromise(fn): Promise<void> {
        return new Promise((resolve, reject) => {
            setImmediate(() => {
                fn();
                resolve();
            });
        });
    }

    it("sets selected file and displays in footer", async () => {
        const mockStorageProvider = MockFactory.createStorageProvider(mockFiles);
        StorageProviderFactory.create = jest.fn(() => mockStorageProvider);
        const connections = MockFactory.createTestConnections();
        const onCancel = jest.fn();
        const onSubmit = jest.fn();
        const wrapper = createComponent({
            connections,
            isOpen: true,
            onCancel,
            onSubmit,
        });

        // Click on connection
        await wrapInPromise(() => wrapper.find("a").first().simulate("click"));
        await flushPromises();
        wrapper.update();

        // Click on file
        await wrapInPromise(() => wrapper.find("a").first().simulate("click"));
        await flushPromises();
        wrapper.update();

        const state = wrapper.find(CloudFilePicker).state();
        expect(state.selectedFile).toEqual(mockFiles[0]);
        expect(state.okDisabled).toBe(false);

        // Footer should show selected file
        expect(wrapper.find("div.modal-footer").text()).toContain(mockFiles[0]);
    });

    it("resets state when 'Go Back' is clicked", async () => {
        const mockStorageProvider = MockFactory.createStorageProvider(mockFiles);
        StorageProviderFactory.create = jest.fn(() => mockStorageProvider);
        const connections = MockFactory.createTestConnections();
        const onCancel = jest.fn();
        const onSubmit = jest.fn();
        const wrapper = createComponent({
            connections,
            isOpen: true,
            onCancel,
            onSubmit,
        });

        // Click on connection
        await wrapInPromise(() => wrapper.find("a").first().simulate("click"));
        await flushPromises();
        wrapper.update();

        // Click back button
        await wrapInPromise(() => wrapper.find("button.btn.btn-secondary").last().simulate("click"));
        await flushPromises();
        wrapper.update();

        const state = wrapper.find(CloudFilePicker).state();
        expect(state.modalHeader).toEqual("Select a Connection");
        expect(state.selectedConnection).toBeNull();
        expect(state.selectedFile).toBeNull();
        expect(state.okDisabled).toBe(true);
        expect(state.backDisabled).toBe(true);
    });

    it("resets state and closes when exit is clicked", async () => {
        const mockStorageProvider = MockFactory.createStorageProvider(mockFiles);
        StorageProviderFactory.create = jest.fn(() => mockStorageProvider);
        const connections = MockFactory.createTestConnections();
        const onCancel = jest.fn();
        const onSubmit = jest.fn();
        const wrapper = createComponent({
            connections,
            isOpen: true,
            onCancel,
            onSubmit,
        });

        // Click on connection
        await wrapInPromise(() => wrapper.find("a").first().simulate("click"));
        await flushPromises();
        wrapper.update();

        // Click close button
        await wrapInPromise(() => wrapper.find("button.close").last().simulate("click"));
        await flushPromises();
        wrapper.update();

        const state = wrapper.find(CloudFilePicker).state();
        expect(state.modalHeader).toEqual("Select a Connection");
        expect(state.selectedConnection).toBeNull();
        expect(state.selectedFile).toBeNull();
        expect(state.okDisabled).toBe(true);
        expect(state.backDisabled).toBe(true);
    });

    it("calls onSubmit when 'Ok' is clicked", async () => {
        const mockStorageProvider = MockFactory.createStorageProvider(mockFiles);
        StorageProviderFactory.create = jest.fn(() => mockStorageProvider);
        const connections = MockFactory.createTestConnections();
        const onCancel = jest.fn();
        const onSubmit = jest.fn();
        const wrapper = createComponent({
            connections,
            isOpen: true,
            onCancel,
            onSubmit,
        });

        // Click on connection
        await wrapInPromise(() => wrapper.find("a").first().simulate("click"));
        await flushPromises();
        wrapper.update();

        // Click on file
        await wrapInPromise(() => wrapper.find("a").first().simulate("click"));
        await flushPromises();
        wrapper.update();

        // Click ok button
        await wrapInPromise(() => wrapper.find("button.btn.btn-success").simulate("click"));
        await flushPromises();
        wrapper.update();

        expect(onSubmit).toBeCalledWith(await mockStorageProvider.readText(mockFiles[0]));
    });

    it("knows the difference between cloud connection and normal connection", () => {
        const connections = MockFactory.createTestConnections();
        for (let i = 0; i < (connections.length / 2); i++) {
            expect(isCloudConnection(connections[i])).toBe(true);
        }
        for (let i = (connections.length / 2); i < connections.length; i++) {
            expect(isCloudConnection(connections[i])).toBe(false);
        }
    });
});