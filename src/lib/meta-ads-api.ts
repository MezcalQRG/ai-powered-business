export interface MetaAdAccount {
  id: string
  name: string
  account_status: number
  currency: string
}

export interface MetaCampaignData {
  name: string
  objective: 'OUTCOME_LEADS' | 'OUTCOME_TRAFFIC' | 'OUTCOME_ENGAGEMENT' | 'OUTCOME_SALES' | 'OUTCOME_AWARENESS'
  status: 'PAUSED' | 'ACTIVE'
  special_ad_categories?: string[]
}

export interface MetaAdSetData {
  name: string
  campaign_id: string
  daily_budget: number
  billing_event: 'IMPRESSIONS' | 'LINK_CLICKS'
  optimization_goal: 'REACH' | 'LINK_CLICKS' | 'IMPRESSIONS' | 'LANDING_PAGE_VIEWS' | 'LEAD_GENERATION'
  bid_amount?: number
  targeting: {
    geo_locations?: {
      countries?: string[]
      cities?: Array<{ key: string; radius?: number; distance_unit?: string }>
    }
    age_min?: number
    age_max?: number
    genders?: number[]
    interests?: Array<{ id: string; name: string }>
    flexible_spec?: any[]
  }
  status: 'PAUSED' | 'ACTIVE'
  start_time?: string
  end_time?: string
}

export interface MetaAdCreativeData {
  name: string
  object_story_spec?: {
    page_id: string
    link_data?: {
      message: string
      link: string
      name?: string
      description?: string
      call_to_action?: {
        type: string
        value?: {
          link?: string
        }
      }
      picture?: string
      image_hash?: string
    }
  }
  degrees_of_freedom_spec?: {
    creative_features_spec: {
      standard_enhancements: {
        enroll_status: 'OPT_IN' | 'OPT_OUT'
      }
    }
  }
}

export interface MetaAdData {
  name: string
  adset_id: string
  creative: {
    creative_id: string
  }
  status: 'PAUSED' | 'ACTIVE'
}

export interface MetaImageUploadResult {
  hash: string
  url?: string
}

export class MetaAdsAPI {
  private accessToken: string
  private apiVersion: string = 'v21.0'
  private baseUrl: string = 'https://graph.facebook.com'

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> {
    const url = `${this.baseUrl}/${this.apiVersion}${endpoint}`
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const params = new URLSearchParams({
      access_token: this.accessToken,
    })

    if (method === 'GET' && data) {
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          params.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key])
        }
      })
    }

    if (method === 'POST' && data) {
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          params.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key])
        }
      })
    }

    const fullUrl = method === 'GET' ? `${url}?${params.toString()}` : url
    
    if (method === 'POST') {
      options.body = params.toString()
      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }

    const response = await fetch(fullUrl, options)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || `Meta API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async getAdAccounts(): Promise<{ data: MetaAdAccount[] }> {
    return this.makeRequest<{ data: MetaAdAccount[] }>('GET', '/me/adaccounts', {
      fields: 'id,name,account_status,currency'
    })
  }

  async createCampaign(adAccountId: string, campaignData: MetaCampaignData): Promise<{ id: string }> {
    return this.makeRequest<{ id: string }>('POST', `/${adAccountId}/campaigns`, campaignData)
  }

  async createAdSet(adAccountId: string, adSetData: MetaAdSetData): Promise<{ id: string }> {
    return this.makeRequest<{ id: string }>('POST', `/${adAccountId}/adsets`, adSetData)
  }

  async uploadImage(adAccountId: string, imageUrl: string): Promise<MetaImageUploadResult> {
    const params = new URLSearchParams({
      access_token: this.accessToken,
      url: imageUrl,
    })

    const response = await fetch(
      `${this.baseUrl}/${this.apiVersion}/${adAccountId}/adimages?${params.toString()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to upload image')
    }

    const result = await response.json()
    const imageData = result.images?.[Object.keys(result.images)[0]]
    
    return {
      hash: imageData.hash,
      url: imageData.url,
    }
  }

  async createAdCreative(adAccountId: string, creativeData: MetaAdCreativeData): Promise<{ id: string }> {
    return this.makeRequest<{ id: string }>('POST', `/${adAccountId}/adcreatives`, creativeData)
  }

  async createAd(adAccountId: string, adData: MetaAdData): Promise<{ id: string }> {
    return this.makeRequest<{ id: string }>('POST', `/${adAccountId}/ads`, adData)
  }

  async getCampaign(campaignId: string): Promise<any> {
    return this.makeRequest('GET', `/${campaignId}`, {
      fields: 'id,name,status,objective,created_time,updated_time'
    })
  }

  async getCampaigns(adAccountId: string): Promise<{ data: any[] }> {
    return this.makeRequest('GET', `/${adAccountId}/campaigns`, {
      fields: 'id,name,status,objective,created_time,updated_time',
      limit: 100
    })
  }

  async getCampaignInsights(campaignId: string): Promise<{ data: any[] }> {
    return this.makeRequest('GET', `/${campaignId}/insights`, {
      fields: 'impressions,clicks,spend,reach,actions,action_values'
    })
  }

  async getAdSetInsights(adSetId: string): Promise<{ data: any[] }> {
    return this.makeRequest('GET', `/${adSetId}/insights`, {
      fields: 'impressions,clicks,spend,reach,ctr,cpc,cpp,cpm'
    })
  }

  async updateCampaignStatus(campaignId: string, status: 'PAUSED' | 'ACTIVE' | 'DELETED'): Promise<{ success: boolean }> {
    return this.makeRequest('POST', `/${campaignId}`, { status })
  }

  async updateAdSetStatus(adSetId: string, status: 'PAUSED' | 'ACTIVE' | 'DELETED'): Promise<{ success: boolean }> {
    return this.makeRequest('POST', `/${adSetId}`, { status })
  }

  async updateAdStatus(adId: string, status: 'PAUSED' | 'ACTIVE' | 'DELETED'): Promise<{ success: boolean }> {
    return this.makeRequest('POST', `/${adId}`, { status })
  }

  async getPages(): Promise<{ data: Array<{ id: string; name: string; access_token: string }> }> {
    return this.makeRequest('GET', '/me/accounts', {
      fields: 'id,name,access_token'
    })
  }

  async searchTargetingInterests(query: string): Promise<{ data: Array<{ id: string; name: string; audience_size_lower_bound: number; audience_size_upper_bound: number }> }> {
    return this.makeRequest('GET', '/search', {
      type: 'adinterest',
      q: query,
      limit: 10
    })
  }

  async getTargetingGeoLocations(locationType: 'country' | 'region' | 'city', query: string): Promise<{ data: any[] }> {
    return this.makeRequest('GET', '/search', {
      type: 'adgeolocation',
      location_types: [locationType],
      q: query,
      limit: 10
    })
  }
}

export async function generateAdImageWithAI(prompt: string): Promise<string> {
  const aiPrompt = window.spark.llmPrompt`Generate a detailed prompt for creating an advertising image based on this business context: ${prompt}. 
  
  The prompt should describe a professional, eye-catching image suitable for a Facebook/Instagram ad. Focus on visual elements, colors, composition, and mood. Keep it under 100 words.`
  
  const imagePrompt = await window.spark.llm(aiPrompt, 'gpt-4o-mini')
  
  return `https://placehold.co/1200x628/6B4CE6/FFFFFF?text=${encodeURIComponent('AI Generated Ad Image')}&font=raleway`
}

export async function generateAdCopyWithAI(businessContext: string, objective: string): Promise<{ headline: string; primaryText: string; description: string; cta: string }> {
  const prompt = window.spark.llmPrompt`You are an expert marketing copywriter. Create compelling ad copy for a Facebook/Instagram campaign.

Business Context: ${businessContext}
Campaign Objective: ${objective}

Generate ad copy with the following components:
1. Headline (max 40 characters) - Attention-grabbing and clear
2. Primary Text (max 125 characters) - Main ad message
3. Description (max 30 characters) - Supporting detail
4. Call-to-Action - Choose from: LEARN_MORE, SHOP_NOW, SIGN_UP, CONTACT_US, GET_QUOTE

Return the result in the exact format below (valid JSON):
{
  "headline": "Your headline here",
  "primaryText": "Your primary text here",
  "description": "Your description here",
  "cta": "LEARN_MORE"
}`

  const result = await window.spark.llm(prompt, 'gpt-4o-mini', true)
  return JSON.parse(result)
}
