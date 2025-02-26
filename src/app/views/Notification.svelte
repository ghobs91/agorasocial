<script>
  import {pipe, filter, map, when, identity, pluck, propEq, uniq} from "ramda"
  import {closure, quantify} from "hurdak/lib/hurdak"
  import {tryJson} from "src/util/misc"
  import {Tags} from "src/util/nostr"
  import PersonBadge from "src/app/shared/PersonBadge.svelte"
  import Card from "src/partials/Card.svelte"
  import Popover from "src/partials/Popover.svelte"
  import NoteContent from "src/app/shared/NoteContent.svelte"
  import NotificationSection from "src/app/views/NotificationSection.svelte"
  import {getPersonWithFallback} from "src/agent/db"
  import {modal} from "src/partials/state"

  export let event

  // Translate zap confirmations to zap requests
  const modifyZaps = pipe(
    map(
      when(propEq("kind", 9735), e => tryJson(() => JSON.parse(Tags.from(e).asMeta().description)))
    ),
    filter(identity)
  )

  const notifications = modifyZaps(event.notifications)
  const note = event.ref || notifications[0]
  const replies = notifications.filter(propEq("kind", 1))
  const likes = notifications.filter(propEq("kind", 7))
  const zaps = notifications.filter(propEq("kind", 9734))
  const author = getPersonWithFallback(note?.pubkey)
  const pubkeys = uniq(pluck("pubkey", notifications))

  const actionText = closure(() => {
    if (replies.length === notifications.length) return "replied to"
    if (likes.length === notifications.length) return "liked"
    if (zaps.length === notifications.length) return "zapped"

    return "reacted to"
  })
</script>

{#if note}
  <div class="flex flex-col items-end gap-1">
    <Card
      interactive
      class="flex w-full flex-col gap-2 text-left notification-card"
      on:click={() => modal.push({type: "note/detail", note})}>
      <div on:click|stopPropagation>
        <!-- {#if !event.ref}
          <div>
            <PersonBadge class="float-left" person={author} />
            <span class="relative top-px pl-1">mentioned you.</span>
          </div>
        {:else}
          <Popover>
            <div slot="trigger">
              {quantify(pubkeys.length, "person", "people")}
              {actionText} your note.
            </div>
            <div slot="tooltip" class="flex flex-col gap-4">
              {#if zaps.length > 0}
                <NotificationSection pubkeys={pluck("pubkey", zaps)}>Zapped by</NotificationSection>
              {/if}
              {#if likes.length > 0}
                <NotificationSection pubkeys={pluck("pubkey", likes)}>Liked by</NotificationSection>
              {/if}
              {#if replies.length > 0}
                <NotificationSection pubkeys={pluck("pubkey", replies)}
                  >Replies</NotificationSection>
              {/if}
            </div>
          </Popover>
        {/if} -->
      </div>
      {#if zaps.length > 0}
        <div class="notification-section-container">
          <i class="fa fa-bolt cursor-pointer"/>
          <NotificationSection pubkeys={pluck("pubkey", zaps)}>Zapped by</NotificationSection>
        </div>
      {/if}
      {#if likes.length > 0}
      <div class="notification-section-container">
        <i class="fa fa-heart cursor-pointer"/>
        <NotificationSection pubkeys={pluck("pubkey", likes)}>Liked by</NotificationSection>
      </div>
      {/if}
      {#if replies.length > 0}
      <div class="notification-section-container">
        <i class="fa fa-reply cursor-pointer"/>
        <NotificationSection pubkeys={pluck("pubkey", replies)}
          >Replies</NotificationSection>
      </div>
      {/if}
      <div class="break-word overflow-hidden notification-referenced-post">
        <NoteContent maxLength={80} showMedia={false} {note} />
      </div>
    </Card>
  </div>
{/if}
