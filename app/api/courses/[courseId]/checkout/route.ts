import Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string; }> }
) {
    try {
        const { courseId } = await params;
        const user = await currentUser();

        if (!user || !user.id || !user.emailAddresses?.[0].emailAddress) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            },
        });

        const purchasedCourse = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId,
                },
            },
        });
        if (purchasedCourse) {
            return new NextResponse("Already purchased this course.", { status: 400 });
        }
        if (!course) {
            return new NextResponse("Course Not Fond.", { status: 404 });
        }


        const line_item: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            quantity: 1,
            price_data: {
                currency: "USD",
                product_data: {
                    name: course.title,
                    description: course.description!,
                },
                unit_amount: Math.round(course.price! * 100),
            },
        }];
        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                stripeCustomerId: true,
            }
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
            });

            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                }
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items: line_item,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]", error);
        return new NextResponse("Internal error...", { status: 500 });
    }
}