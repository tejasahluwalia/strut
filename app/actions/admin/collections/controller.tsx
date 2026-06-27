import { createController } from "remix/router";
import { css } from "remix/ui";
import { routes } from "../../../routes.ts";
import { Button } from "../../../ui/button.tsx";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../../../ui/card.tsx";
import { Document } from "../../../ui/document.tsx";
import { SiteHeader } from "../../../ui/header.tsx";
import { Input } from "../../../ui/input.tsx";
import { Label } from "../../../ui/label.tsx";
import { runCollectionIngestion } from "../../../workflows/collection_ingestion.ts";

export default createController(routes.admin.collections, {
	actions: {
		index(context) {
			// Mock discovered collection needing review
			const collection = {
				id: "col_123",
				event: "Sample Event",
				name: "Collection 1",
				hashtags: "#SampleEvent2026, #EntityA",
				entities: "Entity A",
				status: "needs_review",
			};

			return context.render(
				<Document title="Collections Pending Review | Strut">
					<SiteHeader isAdmin />
					<main
						mix={css({
							maxWidth: "1400px",
							margin: "0 auto",
							padding: "2rem 1.5rem",
							display: "flex",
							flexDirection: "column",
							gap: "2rem",
						})}
					>
						<h1
							mix={css({
								fontSize: "2.25rem",
								fontWeight: "bold",
								margin: 0,
								letterSpacing: "-0.025em",
							})}
						>
							Collections Pending Review
						</h1>

						<Card>
							<CardHeader>
								<CardTitle>
									{collection.event} - {collection.name}
								</CardTitle>
							</CardHeader>
							<form method="post" action="/admin/collections/ingest">
								<CardContent
									mix={css({
										display: "flex",
										flexDirection: "column",
										gap: "1rem",
									})}
								>
									<input
										type="hidden"
										name="collectionId"
										value={collection.id}
									/>

									<div
										mix={css({
											display: "flex",
											flexDirection: "column",
											gap: "0.5rem",
										})}
									>
										<Label>Approved Hashtags (comma separated)</Label>
										<Input
											type="text"
											name="hashtags"
											defaultValue={collection.hashtags}
										/>
									</div>

									<div
										mix={css({
											display: "flex",
											flexDirection: "column",
											gap: "0.5rem",
										})}
									>
										<Label>Approved Entities (comma separated)</Label>
										<Input
											type="text"
											name="entities"
											defaultValue={collection.entities}
										/>
									</div>
								</CardContent>
								<CardFooter>
									<Button type="submit">Approve & Start Ingestion</Button>
								</CardFooter>
							</form>
						</Card>
					</main>
				</Document>,
			);
		},
		async ingest(context) {
			const formData = await context.request.formData();
			const collectionId = formData.get("collectionId") as string;
			const hashtags = (formData.get("hashtags") as string)
				.split(",")
				.map((s) => s.trim());
			const entities = (formData.get("entities") as string)
				.split(",")
				.map((s) => s.trim());

			// Trigger the ingestion stub
			await runCollectionIngestion(collectionId, hashtags, entities);

			// Redirect back to workflows
			return new Response(null, {
				status: 303,
				headers: { Location: "/admin/workflows" },
			});
		},
	},
});
