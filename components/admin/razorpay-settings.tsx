'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface RazorpaySettingsProps {
    keyId?: string;
    isConfigured: boolean;
}

export function RazorpaySettings({ keyId, isConfigured }: RazorpaySettingsProps) {
    const [copied, setCopied] = useState(false);

    const webhookUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/api/payments/razorpay/webhook`
        : '';

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Razorpay Configuration</CardTitle>
                            <CardDescription>Manage your Razorpay payment gateway settings</CardDescription>
                        </div>
                        {isConfigured ? (
                            <Badge className="bg-green-500">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Configured
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                <XCircle className="mr-1 h-3 w-3" />
                                Not Configured
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Razorpay Key ID</Label>
                        <div className="flex gap-2">
                            <Input
                                value={keyId || 'Not configured'}
                                readOnly
                                className="font-mono text-sm"
                            />
                            {keyId && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(keyId)}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This is your public Razorpay key ID used for client-side integration
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Webhook URL</Label>
                        <div className="flex gap-2">
                            <Input
                                value={webhookUrl}
                                readOnly
                                className="font-mono text-sm"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => copyToClipboard(webhookUrl)}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Configure this URL in your Razorpay dashboard to receive payment webhooks
                        </p>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <h4 className="font-medium text-sm">Configuration Instructions</h4>
                        <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                            <li>Create a <code className="bg-background px-1 py-0.5 rounded">.env</code> file in your project root</li>
                            <li>Add the following environment variables:
                                <pre className="mt-2 bg-background p-2 rounded text-xs overflow-x-auto">
                                    {`RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret`}
                                </pre>
                            </li>
                            <li>Get your credentials from the <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">Razorpay Dashboard <ExternalLink className="ml-1 h-3 w-3" /></a></li>
                            <li>Restart your application for changes to take effect</li>
                        </ol>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <a href="https://dashboard.razorpay.com" target="_blank" rel="noopener noreferrer">
                                Open Razorpay Dashboard
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="https://razorpay.com/docs/" target="_blank" rel="noopener noreferrer">
                                View Documentation
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
