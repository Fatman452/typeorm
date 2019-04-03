import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {ConnectionMetadataBuilder} from "../../../../src/connection/ConnectionMetadataBuilder";
import {EntityMetadataValidator} from "../../../../src/metadata-builder/EntityMetadataValidator";

describe("persistence > order of persistence execution operations", () => {

    describe("should throw exception when non-resolvable circular relations found", function() {

        test("should throw CircularRelationsError", () => {
            const connection = new Connection({ // dummy connection options, connection won't be established anyway
                type: "mysql",
                host: "localhost",
                username: "test",
                password: "test",
                database: "test",
                entities: [__dirname + "/entity/*{.js,.ts}"]
            });
            const connectionMetadataBuilder = new ConnectionMetadataBuilder(connection);
            const entityMetadatas = connectionMetadataBuilder.buildEntityMetadatas([__dirname + "/entity/*{.js,.ts}"]);
            const entityMetadataValidator = new EntityMetadataValidator();
            expect(() => entityMetadataValidator.validateMany(entityMetadatas, connection.driver)).toThrow(Error);
        });


    });

    describe.skip("should persist all entities in correct order", function() {

        let connections: Connection[];
        beforeAll(async () => connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
        }));
        beforeEach(() => reloadTestingDatabases(connections));
        afterAll(() => closeTestingConnections(connections));
        test("", () => Promise.all(connections.map(async connection => {

            // create first category and post and save them
            const category1 = new Category();
            category1.name = "Category saved by cascades #1";

            const post1 = new Post();
            post1.title = "Hello Post #1";
            post1.category = category1;

            await connection.manager.save(post1);

            // now check
            /*const posts = await connection.manager.find(Post, {
             alias: "post",
             innerJoinAndSelect: {
             category: "post.category"
             },
             orderBy: {
             "post.id": "ASC"
             }
             });

             expect(posts).toEqual()([{
             id: 1,
             title: "Hello Post #1",
             category: {
             id: 1,
             name: "Category saved by cascades #1"
             }
             }, {
             id: 2,
             title: "Hello Post #2",
             category: {
             id: 2,
             name: "Category saved by cascades #2"
             }
             }]);*/
        })));
    });



});