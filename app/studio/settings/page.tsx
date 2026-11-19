import { saveSettings } from "@/lib/actions";
import { loadStore } from "@/lib/repository";
import { currentSession } from "@/lib/session";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export default async function SettingsPage() {
  const session = await currentSession();
  if (!session) return null;
  const store = await loadStore();
  const settings = store.settings;
  return (
    <form action={saveSettings} className="grid max-w-3xl gap-4 border border-line bg-card p-5 md:p-8">
      <h1>Site text</h1>
      <TextField label="Publisher name" name="authorName" defaultValue={store.author.name} />
      <TextField label="Publisher bio" name="authorBio" defaultValue={store.author.bio} multiline />
      <TextField label="Home introduction" name="homeIntro" defaultValue={settings.homeIntro} multiline />
      <TextField label="Launch introduction" name="launchIntro" defaultValue={settings.launchIntro} multiline />
      <TextField label="Grow introduction" name="growIntro" defaultValue={settings.growIntro} multiline />
      <TextField label="Commission line" name="disclosure" defaultValue={settings.disclosure} multiline />
      <TextField label="About" name="aboutBody" defaultValue={settings.aboutBody} multiline />
      <TextField label="Contact introduction" name="contactIntro" defaultValue={settings.contactIntro} multiline />
      <TextField label="Disclosure page" name="disclosureBody" defaultValue={settings.disclosureBody} multiline />
      <TextField label="Privacy page" name="privacyBody" defaultValue={settings.privacyBody} multiline />
      <TextField label="Launch label" name="navLaunch" defaultValue={settings.navLaunch} />
      <TextField label="Grow label" name="navGrow" defaultValue={settings.navGrow} />
      <TextField label="About label" name="navAbout" defaultValue={settings.navAbout} />
      <TextField label="Contact label" name="navContact" defaultValue={settings.navContact} />
      <Button type="submit">Save site text</Button>
    </form>
  );
}
