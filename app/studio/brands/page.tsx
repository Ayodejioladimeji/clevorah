import { saveBrand } from "@/lib/actions";
import { loadStore } from "@/lib/repository";
import { currentSession } from "@/lib/session";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export default async function BrandsPage() {
  const session = await currentSession();
  if (!session) return null;
  const store = await loadStore();
  const topics = store.topics.map((topic) => ({ value: topic.slug, label: topic.title }));
  return (
    <div className="grid gap-6">
      <h1>Brands</h1>
      <p className="meta">
        Impact uses subId1 and subId2. Awin uses clickref. CJ uses sid. Any other network uses the sub-id parameter on the brand. Leave the affiliate URL empty until the program is connected.
      </p>
      {store.brands.map((brand) => (
        <form key={`${brand.id}-${brand.affiliateUrl}-${brand.paused}`} action={saveBrand} className="grid gap-4 border border-line bg-card p-5 md:grid-cols-2">
          <h2 className="md:col-span-2">{brand.name}</h2>
          <input type="hidden" name="id" value={brand.id} />
          <TextField label="Name" name="name" defaultValue={brand.name} />
          <TextField label="Category" name="topicSlug" defaultValue={brand.topicSlug} options={topics} />
          <TextField label="Network" name="network" defaultValue={brand.network} />
          <TextField label="Signup URL" name="signupUrl" defaultValue={brand.signupUrl} />
          <TextField label="Affiliate URL" name="affiliateUrl" defaultValue={brand.affiliateUrl} />
          <TextField label="Sub-id parameter" name="subIdParam" defaultValue={brand.subIdParam} />
          <TextField label="Country note" name="countryNote" defaultValue={brand.countryNote} multiline />
          <TextField label="Paused" name="paused" type="checkbox" defaultChecked={brand.paused} />
          <div className="md:col-span-2">
            <Button type="submit">Save brand</Button>
          </div>
        </form>
      ))}
    </div>
  );
}
