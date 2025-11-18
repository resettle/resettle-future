import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@resettle/design'
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CheckIcon,
  GlobeIcon,
  SparklesIcon,
  UsersIcon,
} from 'lucide-react'

import Metadata from '~/seo/components/Metadata'

export default function Index() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden">
      <Metadata
        title="Resettle - The World AI for Superindividuals"
        description="The most powerful AI agent for superindividuals to find the best opportunities around the world"
        keywords={[
          'resettle',
          'superindividual',
          'ai',
          'adventure',
          'recommendations',
        ]}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rotate-12 transform rounded-full bg-linear-to-br from-blue-300/60 via-cyan-300/50 to-blue-400/55 blur-3xl"></div>
        <div className="absolute -right-20 -bottom-20 h-80 w-80 -rotate-12 transform rounded-full bg-linear-to-tl from-amber-300/50 via-yellow-300/40 to-orange-300/45 blur-2xl"></div>
        <div className="absolute top-1/3 -left-20 h-72 w-72 rotate-45 transform rounded-full bg-linear-to-r from-blue-500/35 via-teal-400/45 to-cyan-500/40 blur-xl"></div>
        <div className="absolute top-1/4 -right-16 h-64 w-64 -rotate-30 transform rounded-full bg-linear-to-bl from-emerald-300/45 via-cyan-300/35 to-blue-300/40 blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/4 h-48 w-48 rotate-60 transform rounded-full bg-linear-to-tr from-pink-300/35 via-rose-300/30 to-orange-300/35 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 h-32 w-96 -translate-x-1/2 -translate-y-1/2 rotate-12 transform rounded-full bg-linear-to-r from-blue-400/30 via-cyan-400/40 to-teal-400/35 blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <section className="z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-20 sm:py-32">
        <div className="mb-6 flex items-center gap-2">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm">
            <SparklesIcon className="mr-1.5 h-3.5 w-3.5" />
            Now in Beta
          </Badge>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col gap-4 text-center">
          <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your opportunities are{' '}
            <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              waiting for you
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl">
            Join Today and Never Miss Out On a Life-Changing Opportunity Again
          </p>
        </div>

        <Card className="border-border/60 bg-card/80 mt-10 w-full max-w-2xl backdrop-blur-sm">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-background flex-1"
              size="lg"
            />
            <Button size="lg" className="whitespace-nowrap">
              Get Started
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="text-muted-foreground mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-600" />
            <span>Free to join</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-600" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-600" />
            <span>Expert verified</span>
          </div>
        </div>
      </section>

      <Separator className="mx-auto w-full max-w-6xl" />

      {/* Features Section */}
      <section className="z-10 mx-auto w-full max-w-7xl px-4 py-20">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Discover opportunities tailored to your unique journey
          </p>
        </div>

        <Tabs defaultValue="opportunities" className="w-full">
          <TabsList className="mx-auto grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <GlobeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Global Job Search</CardTitle>
                  <CardDescription>
                    Access thousands of opportunities worldwide, tailored to
                    your skills and preferences
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                    <BriefcaseIcon className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <CardTitle>Career Pathways</CardTitle>
                  <CardDescription>
                    Visualize your career progression and discover new paths in
                    different countries
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <SparklesIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle>Smart Matching</CardTitle>
                  <CardDescription>
                    AI-powered recommendations that understand your unique
                    situation and goals
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lifestyle" className="mt-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <div className="h-48 w-full">
                    <img
                      src="/assets/undraw/the-world-is-mine_wnib.svg"
                      alt="New Places & Opportunities"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="text-center text-xl font-semibold">
                    New Places & Opportunities
                  </h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Explore cities and countries that match your lifestyle
                    preferences
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <div className="h-48 w-full">
                    <img
                      src="/assets/undraw/off-road_34hg.svg"
                      alt="Life-Changing Decisions"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="text-center text-xl font-semibold">
                    Life-Changing Decisions
                  </h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Make informed choices with comprehensive data and insights
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <div className="h-48 w-full">
                    <img
                      src="/assets/undraw/career-progress_vfq5.svg"
                      alt="Connection & Friendship"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="text-center text-xl font-semibold">
                    Connection & Friendship
                  </h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Connect with people who share your journey and aspirations
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community" className="mt-8">
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Join a thriving community</CardTitle>
                <CardDescription>
                  Connect with thousands of people who are on the same journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <UsersIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Peer Support</h4>
                      <p className="text-muted-foreground text-sm">
                        Get advice from people who have successfully relocated
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <SparklesIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Expert Insights</h4>
                      <p className="text-muted-foreground text-sm">
                        Access exclusive content from immigration and career
                        experts
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator className="mx-auto w-full max-w-6xl" />

      {/* Testimonials Section */}
      <section className="z-10 mx-auto w-full max-w-7xl px-4 py-20">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Stories from our community
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardContent className="flex flex-col gap-4 p-6">
              <p className="text-muted-foreground text-sm italic">
                "Resettle helped me find the perfect opportunity in Berlin. The
                process was smooth and the community support was incredible."
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                    SA
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">Sarah Anderson</p>
                  <p className="text-muted-foreground text-xs">
                    Software Engineer in Berlin
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardContent className="flex flex-col gap-4 p-6">
              <p className="text-muted-foreground text-sm italic">
                "I never thought relocating could be this easy. Resettle's
                platform made everything clear and manageable."
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                    MC
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">Michael Chen</p>
                  <p className="text-muted-foreground text-xs">
                    Product Manager in Toronto
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardContent className="flex flex-col gap-4 p-6">
              <p className="text-muted-foreground text-sm italic">
                "The community connections I made through Resettle were
                invaluable. I felt supported every step of the way."
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-amber-100 text-amber-600 dark:bg-amber-900/30">
                    EP
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">Emma Patel</p>
                  <p className="text-muted-foreground text-xs">
                    Designer in Amsterdam
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="mx-auto w-full max-w-6xl" />

      {/* FAQ Section */}
      <section className="z-10 mx-auto w-full max-w-3xl px-4 py-20">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does Resettle work?</AccordionTrigger>
            <AccordionContent>
              Resettle is an opportunity search engine that connects you with
              jobs, lifestyle options, and communities in countries around the
              world. Simply create a profile, specify your preferences, and
              we'll match you with the best opportunities.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Is Resettle free to use?</AccordionTrigger>
            <AccordionContent>
              Yes! Creating an account and browsing opportunities is completely
              free. We offer premium features for those who want advanced
              filtering and personalized support.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>What countries do you support?</AccordionTrigger>
            <AccordionContent>
              We support opportunities in over 50 countries across North
              America, Europe, Asia, and Oceania. Our network is constantly
              growing to include more destinations.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              Can Resettle help with visa processes?
            </AccordionTrigger>
            <AccordionContent>
              While we don't directly handle visa applications, we provide
              comprehensive information about visa requirements and connect you
              with immigration experts who can assist with your specific
              situation.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>How do I get started?</AccordionTrigger>
            <AccordionContent>
              Simply enter your email above to create an account. Once you're
              in, complete your profile with your skills, preferences, and
              goals. Our AI will start matching you with relevant opportunities
              immediately.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA Section */}
      <section className="z-10 mx-auto w-full max-w-7xl px-4 py-20">
        <Card className="border-border/60 bg-linear-to-br from-blue-500/10 via-cyan-500/10 to-emerald-500/10 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
            <Badge variant="secondary" className="px-4 py-1.5">
              <SparklesIcon className="mr-1.5 h-3.5 w-3.5" />
              Ready to start?
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Begin your journey today
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Join thousands of people who have found their dream opportunities
              with Resettle
            </p>
            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background flex-1"
                size="lg"
              />
              <Button size="lg" className="whitespace-nowrap">
                Get Started
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
