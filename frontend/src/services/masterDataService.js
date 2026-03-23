import { supabase } from '@/supabaseClient';

/**
 * Master Data Service
 * Handles fetching of core organizational entities like Regions, Cities, Categories, and Products.
 */
export const masterDataService = {
    /**
     * Fetches all regions.
     */
    async getRegions() {
        const { data, error } = await supabase
            .from('regions')
            .select('region_id, region_name')
            .order('region_name');
        if (error) throw error;
        return data;
    },

    /**
     * Fetches all stores, optionally filtered by region/city.
     */
    async getStores({ regionId, cityId, cityIds } = {}) {
        let query = supabase
            .from('stores')
            .select(`
                store_id, 
                store_name,
                city_id,
                cities (
                    city_id,
                    city_name,
                    region_id
                )
            `);

        if (cityIds && cityIds.length > 0) {
            query = query.in('city_id', cityIds);
        } else if (cityId && cityId !== 'all') {
            query = query.eq('city_id', cityId);
        } else if (regionId && regionId !== 'all') {
            query = query.eq('cities.region_id', regionId);
        }

        const { data, error } = await query.order('store_name');
        if (error) throw error;
        return data;
    },
    /**
     * Fetches all cities.
     */
    async getCities() {
        const { data, error } = await supabase
            .from('cities')
            .select('city_id, city_name')
            .order('city_name');
        if (error) throw error;
        return data;
    },

    /**
     * Fetches a single city by name.
     */
    async getCityByName(cityName) {
        const { data, error } = await supabase
            .from('cities')
            .select('city_id')
            .eq('city_name', cityName)
            .single();
        if (error) throw error;
        return data;
    },

    /**
     * Fetches all categories.
     */
    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('category_id, category_name')
            .order('category_name');
        if (error) throw error;
        return data;
    },

    /**
     * Fetches a single category by name.
     */
    async getCategoryByName(categoryName) {
        const { data, error } = await supabase
            .from('categories')
            .select('category_id')
            .eq('category_name', categoryName)
            .single();
        if (error) throw error;
        return data;
    },

    /**
     * Fetches all products.
     */
    async getProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('product_name');
        if (error) throw error;
        return data;
    },

    /**
     * Fetches products by category.
     */
    async getProductsByCategory(categoryId) {
        let query = supabase.from('products').select('*');
        if (categoryId && categoryId !== 'all') {
            query = query.eq('category_id', categoryId);
        }
        const { data, error } = await query.order('product_name');
        if (error) throw error;
        return data;
    }
};
