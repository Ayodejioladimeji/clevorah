"use client";

import { useActionState } from "react";
import { saveComparison, type SaveState } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { AUDIENCE_LABEL, PAGE_TYPE_LABEL, type Audience, type Brand, type Comparison, type PageType, type Topic } from "@/lib/types";

const initial: SaveState = { ok: false, error: "" };

export function ComparisonEditor({
  comparison,
  brands,
  topics,
}: {
  comparison: Comparison;
  brands: Brand[];
  topics: Topic[];
}) {
  const [state, action, pending] = useActionState(saveComparison, initial);
  const criteria = [...comparison.criteria];
  while (criteria.length < 4) criteria.push({ label: "", favorite: "", alternative: "" });
  const answers = [...comparison.answers];
  while (answers.length < 3) answers.push({ question: "", answer: "" });
  const brandOptions = [{ value: "", label: "Select a brand" }, ...brands.map((brand) => ({ value: brand.id, label: brand.name }))];
  return (
    <form action={action} className="grid max-w-3xl gap-4 border border-line bg-card p-5 md:p-8">
      <input type="hidden" name="id" value={comparison.id} />
      <TextField label="Title" name="title" defaultValue={comparison.title} required />
      <TextField label="Slug" name="slug" defaultValue={comparison.slug} required />
      <TextField
        label="Category"
        name="topicSlug"
        defaultValue={comparison.topicSlug}
        options={topics.map((topic) => ({ value: topic.slug, label: topic.title }))}
      />
      <TextField
        label="Page type"
        name="pageType"
        defaultValue={comparison.pageType}
        options={(Object.keys(PAGE_TYPE_LABEL) as PageType[]).map((key) => ({ value: key, label: PAGE_TYPE_LABEL[key] }))}
      />
      <TextField
        label="Audience"
        name="audience"
        defaultValue={comparison.audience}
        options={(Object.keys(AUDIENCE_LABEL) as Audience[]).map((key) => ({ value: key, label: AUDIENCE_LABEL[key] }))}
      />
      <TextField label="Favorite" name="favoriteBrandId" defaultValue={comparison.favoriteBrandId} options={brandOptions} />
      <TextField label="Alternative" name="alternativeBrandId" defaultValue={comparison.alternativeBrandId} options={brandOptions} />
      <TextField label="Verdict" name="verdict" defaultValue={comparison.verdict} multiline />
      <TextField label="Why the favorite won" name="whyFavorite" defaultValue={comparison.whyFavorite} multiline />
      <TextField label="When to choose the alternative" name="whenAlternative" defaultValue={comparison.whenAlternative} multiline />
      <TextField label="Skip the favorite when" name="skipFavorite" defaultValue={comparison.skipFavorite} multiline />
      <TextField label="Skip the alternative when" name="skipAlternative" defaultValue={comparison.skipAlternative} multiline />
      <h2>Criteria</h2>
      {criteria.slice(0, 4).map((row, index) => (
        <div key={index} className="grid gap-3 border border-line bg-card p-4">
          <TextField label="Label" name={`criterialabel${index}`} defaultValue={row.label} />
          <TextField label="Favorite" name={`criteriafavorite${index}`} defaultValue={row.favorite} />
          <TextField label="Alternative" name={`criteriaalternative${index}`} defaultValue={row.alternative} />
        </div>
      ))}
      <h2>Short answers</h2>
      {answers.slice(0, 3).map((row, index) => (
        <div key={index} className="grid gap-3 border border-line bg-card p-4">
          <TextField label="Question" name={`answerquestion${index}`} defaultValue={row.question} />
          <TextField label="Answer" name={`answeranswer${index}`} defaultValue={row.answer} multiline />
        </div>
      ))}
      <TextField label="SEO title" name="seoTitle" defaultValue={comparison.seoTitle} />
      <TextField label="Meta description" name="metaDescription" defaultValue={comparison.metaDescription} multiline />
      <TextField label="Search query" name="searchQuery" defaultValue={comparison.searchQuery} />
      <TextField label="First-hand note" name="firstHandNote" defaultValue={comparison.firstHandNote} multiline />
      <p className="meta">Publishing requires this note. The original date is set once and kept.</p>
      <TextField
        label="Status"
        name="status"
        defaultValue={comparison.status}
        options={[
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
        ]}
      />
      {state.error ? <p>{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        Save
      </Button>
    </form>
  );
}
