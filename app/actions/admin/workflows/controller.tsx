import { Database } from "remix/data-table";
import { createController } from "remix/router";
import { css } from "remix/ui";
import { workflow_run } from "../../../data/schema.ts";
import { routes } from "../../../routes.ts";
import { Alert, AlertDescription, AlertTitle } from "../../../ui/alert.tsx";
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
import { runEventDiscovery } from "../../../workflows/event_discovery.ts";

export default createController(routes.admin.workflows, {
	actions: {
		async index(context) {
			const db = context.get(Database);
			if (!db) return new Response("Database not available", { status: 500 });
			const runs = await db.findMany(workflow_run);
			runs.sort((a, b) => b.started_at - a.started_at);

			const workflows = runs.map((run) => {
				const meta = run.run_metadata ? JSON.parse(run.run_metadata) : {};
				return {
					id: run.id,
					name: run.workflow_name,
					status: run.status,
					url: meta.url || "Unknown URL",
				};
			});

			const hasRunningOrPending = workflows.some(
				(w) => w.status === "running" || w.status === "pending",
			);

			return context.render(
				<Document title="Workflows | Strut">
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
						{hasRunningOrPending && (
							<script>{`
														setInterval(async () => {
															try {
																const res = await fetch("/admin/workflows/status");
																const json = await res.json();
																// Reload if any workflow is no longer in pending or running state
																if (json.some((w) => w.status !== "running" && w.status !== "pending")) {
																	window.location.reload();
																}
															} catch (e) {}
														}, 2000);
													`}</script>
						)}
						<h1
							mix={css({
								fontSize: "2.25rem",
								fontWeight: "bold",
								margin: 0,
								letterSpacing: "-0.025em",
							})}
						>
							Workflows
						</h1>

						<Card>
							<CardHeader>
								<CardTitle>Start Event Discovery</CardTitle>
							</CardHeader>
							<CardContent>
								<form
									method="post"
									action="/admin/workflows/new"
									mix={css({
										display: "flex",
										flexDirection: "column",
										gap: "1rem",
									})}
								>
									<div
										mix={css({
											display: "flex",
											flexDirection: "column",
											gap: "0.5rem",
										})}
									>
										<Label>Event URL</Label>
										<Input
											type="url"
											name="url"
											placeholder="https://..."
											required
										/>
									</div>
									<div>
										<Button type="submit">Start Discovery</Button>
									</div>
								</form>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Recent Workflows</CardTitle>
							</CardHeader>
							<CardContent>
								<div
									mix={css({
										display: "flex",
										flexDirection: "column",
										gap: "1rem",
									})}
								>
									{workflows.length === 0 && <p>No workflows run yet.</p>}
									{workflows.map((wf) => (
										<Alert
											key={wf.id}
											variant={
												wf.status === "needs_review"
													? "warning"
													: wf.status === "running"
														? "info"
														: wf.status === "pending"
															? "default"
															: "default"
											}
										>
											<AlertTitle>
												{wf.name === "event_discovery"
													? "Event Discovery"
													: wf.name}
											</AlertTitle>
											<AlertDescription
												mix={css({
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
												})}
											>
												<span>
													URL: {wf.url} | Status:{" "}
													<span mix={css({ fontWeight: "bold" })}>
														{wf.status}
													</span>
												</span>
												{wf.status === "needs_review" && (
													<a
														href={routes.admin.workflows.show.href({
															id: wf.id,
														})}
														mix={css({ textDecoration: "none" })}
													>
														<Button variant="outline" size="sm">
															Review
														</Button>
													</a>
												)}
											</AlertDescription>
										</Alert>
									))}
								</div>
							</CardContent>
						</Card>
					</main>
				</Document>,
			);
		},
		async new(context) {
			const formData = await context.request.formData();
			const url = formData.get("url") as string;
			if (!url) return new Response("URL required", { status: 400 });

			// Trigger the decoupled workflow process
			await runEventDiscovery(url);

			return new Response(null, {
				status: 303,
				headers: { Location: "/admin/workflows" },
			});
		},
		async status(context) {
			const db = context.get(Database);
			if (!db) return new Response("Database not available", { status: 500 });
			const runs = await db.findMany(workflow_run);
			const statuses = runs.map((run) => ({ id: run.id, status: run.status }));
			return new Response(JSON.stringify(statuses), {
				headers: { "Content-Type": "application/json" },
			});
		},
		async show(context) {
			const id = context.params.id;
			if (!id) return new Response("Missing ID", { status: 400 });

			const db = context.get(Database);
			if (!db) return new Response("Database not available", { status: 500 });
			const runs = await db.findMany(workflow_run, {
				where: { id },
			});
			const run = runs[0];
			if (!run) return new Response("Workflow not found", { status: 404 });

			const meta = run.run_metadata ? JSON.parse(run.run_metadata) : {};
			const eventData = meta.eventData || {};
			const collections = meta.collections || [];
			const hashtags = meta.hashtags || [];

			return context.render(
				<Document title={`Review Workflow - ${run.workflow_name} | Strut`}>
					<SiteHeader isAdmin />
					<main
						mix={css({
							maxWidth: "1000px",
							margin: "0 auto",
							padding: "2rem 1.5rem",
							display: "flex",
							flexDirection: "column",
							gap: "2rem",
						})}
					>
						<div
							mix={css({
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							})}
						>
							<div>
								<h1
									mix={css({
										fontSize: "2.25rem",
										fontWeight: "bold",
										margin: 0,
										letterSpacing: "-0.025em",
									})}
								>
									Review Workflow
								</h1>
								<p
									mix={css({
										color: "hsl(var(--muted-foreground))",
										margin: "0.25rem 0 0 0",
									})}
								>
									ID: {run.id} | Type: {run.workflow_name}
								</p>
							</div>
							<a href="/admin/workflows" mix={css({ textDecoration: "none" })}>
								<Button variant="outline">Back to Workflows</Button>
							</a>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Discovery Proposal Details</CardTitle>
							</CardHeader>
							<form
								method="post"
								action={routes.admin.workflows.approve.href({ id: run.id })}
							>
								<CardContent
									mix={css({
										display: "flex",
										flexDirection: "column",
										gap: "1.5rem",
									})}
								>
									{/* Event Details */}
									<div>
										<h3
											mix={css({
												fontSize: "1.125rem",
												fontWeight: 600,
												marginBottom: "0.75rem",
											})}
										>
											1. Proposed Event
										</h3>
										<div
											mix={css({
												display: "grid",
												gridTemplateColumns: "1fr 1fr",
												gap: "1rem",
											})}
										>
											<div
												mix={css({
													display: "flex",
													flexDirection: "column",
													gap: "0.25rem",
												})}
											>
												<Label>Event Name</Label>
												<Input
													type="text"
													name="eventName"
													defaultValue={eventData.name || ""}
												/>
											</div>
											<div
												mix={css({
													display: "flex",
													flexDirection: "column",
													gap: "0.25rem",
												})}
											>
												<Label>Slug</Label>
												<Input
													type="text"
													name="eventSlug"
													defaultValue={eventData.slug || ""}
												/>
											</div>
											<div
												mix={css({
													display: "flex",
													flexDirection: "column",
													gap: "0.25rem",
												})}
											>
												<Label>Location</Label>
												<Input
													type="text"
													name="eventLocation"
													defaultValue={eventData.location || ""}
												/>
											</div>
											<div
												mix={css({
													display: "flex",
													flexDirection: "column",
													gap: "0.25rem",
												})}
											>
												<Label>Start Date</Label>
												<Input
													type="date"
													name="eventStartDate"
													defaultValue={eventData.start_date || ""}
												/>
											</div>
										</div>
									</div>

									{/* Collections Details */}
									<hr
										mix={css({
											border: "0",
											borderTop: "1px solid hsl(var(--border))",
											margin: "1rem 0",
										})}
									/>
									<div>
										<h3
											mix={css({
												fontSize: "1.125rem",
												fontWeight: 600,
												marginBottom: "0.75rem",
											})}
										>
											2. Proposed Collections
										</h3>
										{collections.map(
											(
												col: { name?: string; entities?: string[] },
												index: number,
											) => (
												<div
													key={index}
													mix={css({
														display: "flex",
														flexDirection: "column",
														gap: "0.5rem",
														padding: "1rem",
														backgroundColor: "hsl(var(--muted)/0.3)",
														borderRadius: "var(--radius)",
														marginBottom: "0.5rem",
													})}
												>
													<div
														mix={css({
															display: "grid",
															gridTemplateColumns: "1fr 1fr",
															gap: "1rem",
														})}
													>
														<div
															mix={css({
																display: "flex",
																flexDirection: "column",
																gap: "0.25rem",
															})}
														>
															<Label>Collection Name</Label>
															<Input
																type="text"
																name={`collectionName_${index}`}
																defaultValue={col.name || ""}
															/>
														</div>
														<div
															mix={css({
																display: "flex",
																flexDirection: "column",
																gap: "0.25rem",
															})}
														>
															<Label>Proposed Entities</Label>
															<Input
																type="text"
																name={`collectionEntities_${index}`}
																defaultValue={col.entities?.join(", ") || ""}
															/>
														</div>
													</div>
												</div>
											),
										)}
									</div>

									{/* Hashtags */}
									<hr
										mix={css({
											border: "0",
											borderTop: "1px solid hsl(var(--border))",
											margin: "1rem 0",
										})}
									/>
									<div>
										<h3
											mix={css({
												fontSize: "1.125rem",
												fontWeight: 600,
												marginBottom: "0.75rem",
											})}
										>
											3. Proposed Instagram Hashtags
										</h3>
										<div
											mix={css({
												display: "flex",
												flexDirection: "column",
												gap: "0.25rem",
											})}
										>
											<Label>Hashtags (comma separated)</Label>
											<Input
												type="text"
												name="hashtags"
												defaultValue={hashtags.join(", ")}
											/>
										</div>
									</div>
								</CardContent>

								<CardFooter
									mix={css({
										display: "flex",
										justifyContent: "flex-end",
										gap: "1rem",
									})}
								>
									<a
										href="/admin/workflows"
										mix={css({ textDecoration: "none" })}
									>
										<Button type="button" variant="outline">
											Reject / Cancel
										</Button>
									</a>
									<Button type="submit">Approve Proposal</Button>
								</CardFooter>
							</form>
						</Card>
					</main>
				</Document>,
			);
		},
		async approve(context) {
			const id = context.params.id;
			if (!id) return new Response("Missing ID", { status: 400 });

			const db = context.get(Database);
			if (!db) return new Response("Database not available", { status: 500 });
			const runs = await db.findMany(workflow_run, {
				where: { id },
			});
			const run = runs[0];
			if (!run) return new Response("Workflow not found", { status: 404 });

			const formData = await context.request.formData();

			// Extract approved data
			const eventName = formData.get("eventName") as string;
			const eventLocation = formData.get("eventLocation") as string;
			const hashtags = ((formData.get("hashtags") as string) || "")
				.split(",")
				.map((s) => s.trim());

			// For now, update the workflow run status to 'completed'
			const nowInSeconds = Math.floor(Date.now() / 1000);
			const meta = run.run_metadata ? JSON.parse(run.run_metadata) : {};

			await db.update(workflow_run, run.id, {
				status: "completed",
				completed_at: nowInSeconds,
				run_metadata: JSON.stringify({
					...meta,
					approvedData: {
						eventName,
						eventLocation,
						hashtags,
					},
				}),
			});

			console.log(
				`[Workflow Review] Approved workflow run ${run.id}. Saved approved data.`,
			);

			return new Response(null, {
				status: 303,
				headers: { Location: "/admin/workflows" },
			});
		},
	},
});
