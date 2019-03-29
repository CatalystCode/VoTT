import _ from "lodash";
import { TFPascalVOCExportProvider, ITFPascalVOCExportProviderOptions } from "./tensorFlowPascalVOC";
import { ExportAssetState } from "./exportProvider";
import registerProviders from "../../registerProviders";
import { ExportProviderFactory } from "./exportProviderFactory";
import {
    IAssetMetadata, AssetState, IRegion,
    RegionType, IPoint, IExportProviderOptions,
} from "../../models/applicationState";
import MockFactory from "../../common/mockFactory";

jest.mock("../../services/assetService");
import { AssetService } from "../../services/assetService";

jest.mock("../storage/localFileSystemProxy");
import { LocalFileSystemProxy } from "../storage/localFileSystemProxy";
import registerMixins from "../../registerMixins";
import HtmlFileReader from "../../common/htmlFileReader";
import { appInfo } from "../../common/appInfo";
import { AssetProviderFactory } from "../storage/assetProviderFactory";

registerMixins();

describe("TFPascalVOC Json Export Provider", () => {
    const testAssets = MockFactory.createTestAssets(10, 1);
    const baseTestProject = MockFactory.createTestProject("Test Project");
    baseTestProject.assets = {
        "asset-1": MockFactory.createTestAsset("1", AssetState.Tagged),
        "asset-2": MockFactory.createTestAsset("2", AssetState.Tagged),
        "asset-3": MockFactory.createTestAsset("3", AssetState.Visited),
    };
    baseTestProject.sourceConnection = MockFactory.createTestConnection("test", "localFileSystemProxy");
    baseTestProject.targetConnection = MockFactory.createTestConnection("test", "localFileSystemProxy");

    const tagLengthInPbtxt = 31;

    HtmlFileReader.getAssetArray = jest.fn(() => {
        return Promise.resolve(new Uint8Array([1, 2, 3]).buffer);
    });

    beforeAll(() => {
        AssetProviderFactory.create = jest.fn(() => {
            return {
                getAssets: jest.fn(() => Promise.resolve(testAssets)),
            };
        });
    });

    beforeEach(() => {
        registerProviders();
    });

    it("Is defined", () => {
        expect(TFPascalVOCExportProvider).toBeDefined();
    });

    it("Can be instantiated through the factory", () => {
        const options: ITFPascalVOCExportProviderOptions = {
            assetState: ExportAssetState.All,
            exportUnassigned: true,
            testTrainSplit: 80,
        };
        const exportProvider = ExportProviderFactory.create("tensorFlowPascalVOC", baseTestProject, options);
        expect(exportProvider).not.toBeNull();
        expect(exportProvider).toBeInstanceOf(TFPascalVOCExportProvider);
    });

    describe("Export variations", () => {
        beforeEach(() => {
            const assetServiceMock = AssetService as jest.Mocked<typeof AssetService>;
            assetServiceMock.prototype.getAssetMetadata = jest.fn((asset) => {
                const mockTag = MockFactory.createTestTag();

                const mockStartPoint: IPoint = {
                    x: 1,
                    y: 2,
                };

                const mockEndPoint: IPoint = {
                    x: 3,
                    y: 4,
                };

                const mockRegion: IRegion = {
                    id: "id",
                    type: RegionType.Rectangle,
                    tags: [mockTag.name],
                    points: [mockStartPoint, mockEndPoint],
                };

                const assetMetadata: IAssetMetadata = {
                    asset,
                    regions: [mockRegion],
                    version: appInfo.version,
                };

                return Promise.resolve(assetMetadata);
            });

            const storageProviderMock = LocalFileSystemProxy as jest.Mock<LocalFileSystemProxy>;
            storageProviderMock.mockClear();
        });

        it("Exports all assets", async () => {
            const options: ITFPascalVOCExportProviderOptions = {
                assetState: ExportAssetState.All,
                exportUnassigned: true,
                testTrainSplit: 80,
            };

            const testProject = { ...baseTestProject };
            testProject.tags = MockFactory.createTestTags(3);

            const exportProvider = new TFPascalVOCExportProvider(testProject, options);
            await exportProvider.export();

            const storageProviderMock = LocalFileSystemProxy as any;
            const createContainerCalls = storageProviderMock.mock.instances[0].createContainer.mock.calls;

            expect(createContainerCalls.length).toEqual(5);
            expect(createContainerCalls[1][0].endsWith("/JPEGImages")).toEqual(true);
            expect(createContainerCalls[2][0].endsWith("/Annotations")).toEqual(true);
            expect(createContainerCalls[3][0].endsWith("/ImageSets")).toEqual(true);
            expect(createContainerCalls[4][0].endsWith("/ImageSets/Main")).toEqual(true);

            const writeBinaryCalls = storageProviderMock.mock.instances[0].writeBinary.mock.calls;
            expect(writeBinaryCalls.length).toEqual(testAssets.length);
            expect(writeBinaryCalls[0][0].endsWith("/JPEGImages/Asset 1.jpg")).toEqual(true);
            expect(writeBinaryCalls[1][0].endsWith("/JPEGImages/Asset 2.jpg")).toEqual(true);
            expect(writeBinaryCalls[2][0].endsWith("/JPEGImages/Asset 3.jpg")).toEqual(true);
            expect(writeBinaryCalls[3][0].endsWith("/JPEGImages/Asset 4.jpg")).toEqual(true);

            const writeTextFileCalls = storageProviderMock.mock.instances[0].writeText.mock.calls as any[];
            // We write an annotation XML file per asset, 2 files per tag + 1 label map file
            expect(writeTextFileCalls.length).toEqual(testAssets.length + (testProject.tags.length * 2) + 1);
            expect(writeTextFileCalls[0][0].endsWith("pascal_label_map.pbtxt")).toEqual(true);
            expect(writeTextFileCalls[0][1].length)
                .toEqual((tagLengthInPbtxt * testProject.tags.length));

            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/Annotations/Asset 1.xml")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/Annotations/Asset 2.xml")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/Annotations/Asset 3.xml")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/Annotations/Asset 4.xml")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 0_val.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 1_val.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 2_val.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 0_train.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 1_train.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 2_train.txt")))
                .toBeGreaterThanOrEqual(0);
        });

        it("Exports only visited assets (includes tagged)", async () => {
            const options: ITFPascalVOCExportProviderOptions = {
                assetState: ExportAssetState.Visited,
                exportUnassigned: true,
                testTrainSplit: 80,
            };

            const testProject = { ...baseTestProject };
            testProject.tags = MockFactory.createTestTags(1);

            const exportProvider = new TFPascalVOCExportProvider(testProject, options);
            await exportProvider.export();

            const storageProviderMock = LocalFileSystemProxy as any;
            const createContainerCalls = storageProviderMock.mock.instances[0].createContainer.mock.calls;

            expect(createContainerCalls.length).toEqual(5);
            expect(createContainerCalls[1][0].endsWith("/JPEGImages")).toEqual(true);
            expect(createContainerCalls[2][0].endsWith("/Annotations")).toEqual(true);
            expect(createContainerCalls[3][0].endsWith("/ImageSets")).toEqual(true);
            expect(createContainerCalls[4][0].endsWith("/ImageSets/Main")).toEqual(true);

            const writeBinaryCalls = storageProviderMock.mock.instances[0].writeBinary.mock.calls;
            expect(writeBinaryCalls.length).toEqual(3);
            expect(writeBinaryCalls[0][0].endsWith("/JPEGImages/Asset 1.jpg")).toEqual(true);
            expect(writeBinaryCalls[1][0].endsWith("/JPEGImages/Asset 2.jpg")).toEqual(true);
            expect(writeBinaryCalls[2][0].endsWith("/JPEGImages/Asset 3.jpg")).toEqual(true);

            const writeTextFileCalls = storageProviderMock.mock.instances[0].writeText.mock.calls as any[];
            expect(writeTextFileCalls.length).toEqual(6);
            expect(writeTextFileCalls[0][0].endsWith("pascal_label_map.pbtxt")).toEqual(true);
            expect(writeTextFileCalls[0][1].length)
                .toEqual((tagLengthInPbtxt * testProject.tags.length));

            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/Annotations/Asset 1.xml")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/Annotations/Asset 2.xml")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/Annotations/Asset 3.xml")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 0_val.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 0_train.txt")))
                .toBeGreaterThanOrEqual(0);
        });

        it("Exports only tagged assets", async () => {
            const options: ITFPascalVOCExportProviderOptions = {
                assetState: ExportAssetState.Tagged,
                exportUnassigned: true,
                testTrainSplit: 80,
            };

            const testProject = { ...baseTestProject };
            testProject.tags = MockFactory.createTestTags(3);

            const exportProvider = new TFPascalVOCExportProvider(testProject, options);
            await exportProvider.export();

            const storageProviderMock = LocalFileSystemProxy as any;
            const createContainerCalls = storageProviderMock.mock.instances[0].createContainer.mock.calls;

            expect(createContainerCalls.length).toEqual(5);
            expect(createContainerCalls[1][0].endsWith("/JPEGImages")).toEqual(true);
            expect(createContainerCalls[2][0].endsWith("/Annotations")).toEqual(true);
            expect(createContainerCalls[3][0].endsWith("/ImageSets")).toEqual(true);
            expect(createContainerCalls[4][0].endsWith("/ImageSets/Main")).toEqual(true);

            const writeBinaryCalls = storageProviderMock.mock.instances[0].writeBinary.mock.calls;
            expect(writeBinaryCalls.length).toEqual(2);
            expect(writeBinaryCalls[0][0].endsWith("/JPEGImages/Asset 1.jpg")).toEqual(true);
            expect(writeBinaryCalls[1][0].endsWith("/JPEGImages/Asset 2.jpg")).toEqual(true);

            const writeTextFileCalls = storageProviderMock.mock.instances[0].writeText.mock.calls as any[];
            expect(writeTextFileCalls.length).toEqual(9);
            expect(writeTextFileCalls[0][0].endsWith("pascal_label_map.pbtxt")).toEqual(true);
            expect(writeTextFileCalls[0][1].length)
                .toEqual((tagLengthInPbtxt * testProject.tags.length));

            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/Annotations/Asset 1.xml")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/Annotations/Asset 2.xml")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 0_val.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 1_val.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 2_val.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 0_train.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 1_train.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls.findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 2_train.txt")))
                .toBeGreaterThanOrEqual(0);
        });

        it("Export includes unassigned tags", async () => {
            const options: ITFPascalVOCExportProviderOptions = {
                assetState: ExportAssetState.Tagged,
                exportUnassigned: true,
                testTrainSplit: 80,
            };

            const testProject = { ...baseTestProject };
            const testAssets = MockFactory.createTestAssets(10, 0);
            testAssets.forEach((asset) => asset.state = AssetState.Tagged);
            testProject.assets = _.keyBy(testAssets, (asset) => asset.id);
            testProject.tags = MockFactory.createTestTags(3);

            const exportProvider = new TFPascalVOCExportProvider(testProject, options);
            await exportProvider.export();

            const storageProviderMock = LocalFileSystemProxy as any;
            const writeTextFileCalls = storageProviderMock.mock.instances[0].writeText.mock.calls as any[];

            expect(writeTextFileCalls
                .findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 0_val.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls
                .findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 0_train.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls
                .findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 1_val.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls
                .findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 1_train.txt")))
                .toBeGreaterThanOrEqual(0);
        });

        it("Export does not include unassigned tags", async () => {
            const options: ITFPascalVOCExportProviderOptions = {
                assetState: ExportAssetState.Tagged,
                exportUnassigned: false,
                testTrainSplit: 80,
            };

            const testProject = { ...baseTestProject };
            const testAssets = MockFactory.createTestAssets(10, 0);
            testAssets.forEach((asset) => asset.state = AssetState.Tagged);
            testProject.assets = _.keyBy(testAssets, (asset) => asset.id);
            testProject.tags = MockFactory.createTestTags(3);

            const exportProvider = new TFPascalVOCExportProvider(testProject, options);
            await exportProvider.export();

            const storageProviderMock = LocalFileSystemProxy as any;
            const writeTextFileCalls = storageProviderMock.mock.instances[0].writeText.mock.calls as any[];

            expect(writeTextFileCalls
                .findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 0_val.txt")))
                .toEqual(-1);
            expect(writeTextFileCalls
                .findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 0_train.txt")))
                .toEqual(-1);
            expect(writeTextFileCalls
                .findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 1_val.txt")))
                .toBeGreaterThanOrEqual(0);
            expect(writeTextFileCalls
                .findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 1_train.txt")))
                .toBeGreaterThanOrEqual(0);
        });

        describe("Test Train Splits", () => {
            async function testTestTrainSplit(testTrainSplit: number): Promise<void> {
                const options: ITFPascalVOCExportProviderOptions = {
                    assetState: ExportAssetState.Tagged,
                    exportUnassigned: false,
                    testTrainSplit,
                };

                const testProject = { ...baseTestProject };
                const testAssets = MockFactory.createTestAssets(10, 0);
                testAssets.forEach((asset) => asset.state = AssetState.Tagged);
                testProject.assets = _.keyBy(testAssets, (asset) => asset.id);
                testProject.tags = [MockFactory.createTestTag("1")];

                const exportProvider = new TFPascalVOCExportProvider(testProject, options);
                await exportProvider.export();

                const storageProviderMock = LocalFileSystemProxy as any;
                const writeTextFileCalls = storageProviderMock.mock.instances[0].writeText.mock.calls as any[];

                const valDataIndex = writeTextFileCalls
                    .findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 1_val.txt"));
                const trainDataIndex = writeTextFileCalls
                    .findIndex((args) => args[0].endsWith("/ImageSets/Main/Tag 1_train.txt"));

                const expectedTrainCount = (testTrainSplit / 100) * testAssets.length;
                const expectedTestCount = ((100 - testTrainSplit) / 100) * testAssets.length;

                expect(writeTextFileCalls[valDataIndex][1].split("\n")).toHaveLength(expectedTestCount);
                expect(writeTextFileCalls[trainDataIndex][1].split("\n")).toHaveLength(expectedTrainCount);
            }

            it("Correctly generated files based on 50/50 test / train split", async () => {
                await testTestTrainSplit(50);
            });

            it("Correctly generated files based on 60/40 test / train split", async () => {
                await testTestTrainSplit(60);
            });

            it("Correctly generated files based on 80/20 test / train split", async () => {
                await testTestTrainSplit(80);
            });

            it("Correctly generated files based on 90/10 test / train split", async () => {
                await testTestTrainSplit(90);
            });
        });
    });
});
