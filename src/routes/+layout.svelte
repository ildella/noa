<script>
  import '@fortawesome/fontawesome-free/css/all.min.css'
  import {page} from '$app/state'
  // import Transition from '$lib/layout/Transition.svelte'
  import Header from '$lib/layout/Header.svelte'
  import Footer from '$lib/layout/Footer.svelte'
  import '../app.css'

  const {children} = $props()

  // const {url: {href}} = page
  const {data} = page
  const title = data.title || 'Nostr Onboarding'
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class='container mx-auto max-w-3xl overflow-x-hidden'>
  <Header />
  <main class='py-16 px-4'>
    <!-- <Transition pathname={data?.pathname} children={children}> -->
    {@render children?.()}
    <!-- </Transition> -->
  </main>
  <Footer />
</div>
