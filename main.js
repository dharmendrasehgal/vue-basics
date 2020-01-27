//Add a description to the data object with the value "A pair of warm, fuzzy socks". Then display the description using an expression in an p element, underneath the h1.
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div>
        <div class="product">
            <!--a :href="url"-->
              <div class="product-image">
                <img :src='image' />
              </div>
            <!--/a-->

            <div class="product-info">
              <h1>{{ title }}</h1>
              <p>User is Premium: {{ shipping }}</p>
              <p>{{ description }}</p>
              <p v-if="inventory > 10">In Stock</p>
              <product-details :details="details"></product-details>
              <h2>Available in Sizes</h2>
              <ul>
                <li v-for="size in sizes">{{ size }}</li>
              </ul>
              <p v-if="onSale">On Sale!</p>
              <p v-else-if="inventory <= 10 & inventory > 0">Almost Out of Stock!</p>
              <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
              <div v-for="(variant, index) in variants"
                   :key="variant.variantId"
                   @mouseover="updateProduct(index)"
                   :style="{ backgroundColor: variant.variantColor }"
                   class="color-box"
              ></div>
              <button @click="addToCart"
                      :disabled="!inStock"
                      :class="{ disabledButton: !inStock }"
              >Add To Cart</button><br />
              <button @click="removeFromCart" class="" v-show="inStock">Remove From Cart</button>
            </div>
            </div>
            <div class="product-reviews">
              <p v-if="!reviews.length">There are no reviews yet.</p>
              <ul v-else>
                  <li v-for="(review, index) in reviews" :key="index">
                    <p>{{ review.name }}</p>
                    <p>Rating:{{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                  </li>
              </ul>
              <product-review @review-submitted="addReview"></product-review>
            </div>
          </div>
    `,
    data() {
        return {
            brand: 'Amazing',
            product: 'Socks',
            description: 'A pair of warm, fuzzy socks',
            selectedVarient: 0,
            url: 'https://google.com',
            inventory: 0,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
              {
                variantId: 2234,
                variantColor: 'green',
                variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
                variantQuantity: 10,
                onSale: true
              },
              {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
                variantQuantity: 1,
                onSale: false
              }
            ],
            sizes: ['2*3','5.6','8*6'],
            reviews: []
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVarient].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVarient].variantQuantity;
        },
        onSale() {
            return this.variants[this.selectedVarient].onSale;
        },
        shipping() {
            if(this.premium) {
                return 'Free!';
            } else {
                return 2.99
            }
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVarient].variantId);
        },
        updateProduct(index) {
            this.selectedVarient = index;
        },
        removeFromCart() {
            this.$emit('remove-from-cart',this.variants[this.selectedVarient].variantId);
        },
        addReview(productReview) {
          this.reviews.push(productReview)
        }
    }
});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
    `
});

Vue.component('product-review', {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">

        <p class="error" v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>

        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name">
        </p>

        <p>
          <label for="review">Review:</label>
          <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <p>
          <input type="submit" value="Submit" class="button">
        </p>

    </form>
    `,
    data() {
      return {
        name: null,
        review: null,
        rating: null,
        errors: []
      }
    },
    methods: {
      onSubmit() {
        this.errors = []
        if(this.name && this.review && this.rating) {
          let productReview = {
            name: this.name,
            review: this.review,
            rating: this.rating
          }
          this.$emit('review-submitted', productReview)
          this.name = null
          this.review = null
          this.rating = null
        } else {
          if(!this.name) this.errors.push("Name required.")
          if(!this.review) this.errors.push("Review required.")
          if(!this.rating) this.errors.push("Rating required.")
        }
      }
    }
  })

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeToCart(id) {
            for (var i = this.cart.length-1; i >= 0; i--) {
                if(this.cart[i] === id) {
                    this.cart.splice(i,1);
                }
            }
        }
    }
});