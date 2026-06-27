export async function runCollectionIngestion(
	collectionId: string,
	hashtags: string[],
	_entities: string[],
) {
	const runId = crypto.randomUUID();
	console.log(
		`[Collection Ingestion] Starting workflow for Collection: ${collectionId} with run_id: ${runId}`,
	);

	// Stubbed Step 1: Media Discovery
	console.log(
		`[Collection Ingestion] Searching Instagram posts for hashtags: ${hashtags.join(", ")}`,
	);
	const foundPosts = [
		{
			url: "https://instagram.com/p/123",
			mediaUrl: "https://example.com/img1.jpg",
			hash: "hash1",
		},
		{
			url: "https://instagram.com/p/456",
			mediaUrl: "https://example.com/img2.jpg",
			hash: "hash2",
		},
		{
			url: "https://instagram.com/p/123",
			mediaUrl: "https://example.com/img1.jpg",
			hash: "hash1",
		}, // Duplicate
	];

	// Stubbed Step 2: Media Ingestion
	console.log(`[Collection Ingestion] Copying media to R2`);

	// Stubbed Step 3: Deduplication
	console.log(`[Collection Ingestion] Deduplicating media`);
	const uniqueMedia = foundPosts.filter(
		(post, index, self) =>
			index === self.findIndex((t) => t.hash === post.hash),
	);

	// Stubbed Step 4: Look Grouping
	console.log(
		`[Collection Ingestion] Grouping media into Looks via visual embeddings`,
	);
	const looks = uniqueMedia.map((m, i) => ({ id: `look-${i}`, media: [m] }));

	// Stubbed Step 5: Tagging
	console.log(`[Collection Ingestion] Tagging looks`);
	const taggedLooks = looks.map((look) => ({
		...look,
		tags: ["designer_EntityA", "color_red"],
	}));

	// Stubbed Step 6: Publish
	console.log(`[Collection Ingestion] Publishing looks`);

	return {
		runId,
		taggedLooks,
		status: "completed",
	};
}
