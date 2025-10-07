let { getPost } = require('../src/net');

describe("getPost", () => {
    let MockFetch;
    
    beforeEach(() => {
        MockFetch = jest.fn(); // Create a new mock function before each test
    });
    test("getPost (sendObj)", async () => {
        const fake = { id: 1, title: 'foo', body: 'bar', userId: 1 };

        MockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => fake
        });

        const data = await getPost(1, MockFetch);
        expect(MockFetch).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/posts/1`);  // Check if MockFetch was called with the correct argument
        expect(data).toEqual(fake); // Check if getPost returns a Promise
    });
});