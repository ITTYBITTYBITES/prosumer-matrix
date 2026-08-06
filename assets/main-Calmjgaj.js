(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();function m(r,e=400){if(!r||typeof r!="string")return"";try{new URL(r)}catch{return""}const t=encodeURIComponent(r),s=Math.round(e*1);return`https://images.weserv.nl/?url=${t}&w=${e}&h=${s}&output=webp&q=85`}function u(r){const e={"3D Printers":b(),"CNC & Laser Cutters":k(),"Off-Grid Solar & Power":C(),"Thermal & Mapping Drones":S(),"Prosumer Espresso":E(),"Utility EVs":x()};return e[r]||e["3D Printers"]}function b(){return'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect x="8" y="8" width="48" height="48" rx="4" fill="%231E293B" stroke="%23334155" stroke-width="2"/%3E%3Cpath d="M18 22h28M18 32h22M18 42h16" stroke="%230EA5E9" stroke-width="3" stroke-linecap="round" fill="none"/%3E%3Ccircle cx="46" cy="42" r="4" fill="%2310B981"/%3E%3C/svg%3E'}function k(){return'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect x="12" y="16" width="40" height="32" rx="2" fill="%231E293B" stroke="%230EA5E9" stroke-width="2"/%3E%3Cpath d="M24 28l8 8 8-8M28 36h8M28 40h8" stroke="%2310B981" stroke-width="2" stroke-linecap="round" fill="none"/%3E%3C/svg%3E'}function C(){return'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Cpolygon points="32,8 8,48 56,48" fill="%231E293B" stroke="%230EA5E9" stroke-width="2" stroke-linejoin="round"/%3E%3Ccircle cx="32" cy="32" r="4" fill="%2310B981"/%3E%3C/svg%3E'}function S(){return'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Ccircle cx="32" cy="32" r="8" fill="%231E293B" stroke="%230EA5E9" stroke-width="2"/%3E%3Cpath d="M8 24h16M8 40h16M40 24h16M40 40h16" stroke="%230EA5E9" stroke-width="2" stroke-linecap="round"/%3E%3Ccircle cx="8" cy="24" r="3" fill="%2310B981"/%3E%3Ccircle cx="8" cy="40" r="3" fill="%2310B981"/%3E%3Ccircle cx="56" cy="24" r="3" fill="%2310B981"/%3E%3Ccircle cx="56" cy="40" r="3" fill="%2310B981"/%3E%3C/svg%3E'}function E(){return'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Cellipse cx="32" cy="20" rx="18" ry="8" fill="%231E293B" stroke="%230EA5E9" stroke-width="2"/%3E%3Cpath d="M14 30v16M50 30v16M32 30v12" stroke="%231E293B" stroke-width="3" stroke-linecap="round"/%3E%3Cpath d="M18 46h28M22 50h20" stroke="%2310B981" stroke-width="3" stroke-linecap="round" fill="none"/%3E%3C/svg%3E'}function x(){return'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect x="16" y="24" width="32" height="20" rx="4" fill="%231E293B" stroke="%230EA5E9" stroke-width="2"/%3E%3Ccircle cx="22" cy="44" r="6" fill="%2310B981"/%3E%3Ccircle cx="42" cy="44" r="6" fill="%2310B981"/%3E%3Cpath d="M10 28h4v-4M50 28h4v-4" stroke="%230EA5E9" stroke-width="2" stroke-linecap="round"/%3E%3C/svg%3E'}const h={IMPACT_PUBLISHER_ID:"PLACEHOLDER_IMPACT_MPID",AWIN_PUBLISHER_ID:"PLACEHOLDER_AWIN_PID",SHAREASALE_USER_ID:"PLACEHOLDER_SHAREASALE_ID",AMAZON_TAG:"PLACEHOLDER_AMAZON_TAG"};function _(){const{IMPACT_PUBLISHER_ID:r,AWIN_PUBLISHER_ID:e,SHAREASALE_USER_ID:t,AMAZON_TAG:s}=h;return r.startsWith("PLACEHOLDER")&&e.startsWith("PLACEHOLDER")&&t.startsWith("PLACEHOLDER")&&s.startsWith("PLACEHOLDER")}function M(r){if(_())return r.directUrl||"#";switch((r.affiliateNetwork||"").toLowerCase()){case"impact":return L(r);case"awin":return P(r);case"shareasale":return $(r);case"amazon":return B(r);default:return r.directUrl||"#"}}function L(r){const{IMPACT_PUBLISHER_ID:e}=h,t=r.merchantId||"",s="https://impact.com/c/",a=encodeURIComponent(e);return`${s}${t}?affid=${a}&jmp=true`}function P(r){const{AWIN_PUBLISHER_ID:e}=h,t=r.merchantId||"";return`https://www.awin1.com/cread.php?awinmid=${e}&awinaffid=${e}&clickref=${t}&p=${encodeURIComponent(r.name||"")}`}function $(r){const{SHAREASALE_USER_ID:e}=h;return`https://shareasale.com/r.cfm?b=${r.merchantId||""}&u=${e}&m=shop`}function B(r){const{AMAZON_TAG:e}=h;let t=r.amazonAsin;if(!t&&r.merchantId&&(t=r.merchantId),!t){const i=new URL(r.directUrl||"").pathname.split("/");for(const l of i)if(/^[B][0-9A-Z]{9}$/.test(l)){t=l;break}}return t||(t=r.merchantId||"UNKNOWN"),`https://www.amazon.com/dp/${t}/?tag=${e}`}function f(r){return{impact:"Impact",awin:"Awin",shareasale:"ShareASale",amazon:"Amazon",none:"Direct"}[r==null?void 0:r.toLowerCase()]||"Direct"}class I{constructor(e,t){this.container=typeof e=="string"?document.querySelector(e):e,this.products=t||[],this.filteredProducts=[...this.products],this.selectedCategory="all",this.searchQuery="",this.sortColumn="name",this.sortDirection="asc",this.render(),this.attachEventListeners()}render(){this.container.innerHTML=`
      <div class="matrix-app">
        <!-- Header -->
        <header class="matrix-header">
          <div class="matrix-brand">
            <svg class="matrix-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="#0EA5E9"/>
              <path d="M8 10h16M8 16h12M8 22h8" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="24" cy="22" r="3" fill="#10B981"/>
            </svg>
            <div class="matrix-brand-text">
              <h1 class="matrix-title">PROsumer MATRIX</h1>
              <p class="matrix-subtitle">Hardware & Equipment Specification Database</p>
            </div>
          </div>
          <div class="matrix-stats">
            <div class="stat-item">
              <span class="stat-value">${this.products.length}</span>
              <span class="stat-label">Products</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.getCategoryCount()}</span>
              <span class="stat-label">Categories</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">$${this.getPriceRange()}</span>
              <span class="stat-label">Price Range</span>
            </div>
          </div>
        </header>

        <!-- Search and Filter Bar -->
        <div class="matrix-controls">
          <div class="search-container">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              class="matrix-search"
              placeholder="Search specs, names, brands..."
              id="searchInput"
              aria-label="Search products"
            >
            <button class="search-clear" id="searchClear" aria-label="Clear search" style="display: none;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="category-pills" id="categoryPills" role="tablist" aria-label="Filter by category">
            <button class="category-pill ${this.selectedCategory==="all"?"active":""}" data-category="all" role="tab" aria-selected="${this.selectedCategory==="all"}">
              All
            </button>
            ${this.getCategoryPills()}
          </div>

          <div class="sort-controls">
            <label class="sort-label" for="sortSelect">Sort by:</label>
            <select id="sortSelect" class="sort-select" aria-label="Sort products">
              <option value="name" ${this.sortColumn==="name"?"selected":""}>Name</option>
              <option value="priceUsd" ${this.sortColumn==="priceUsd"?"selected":""}>Price</option>
              <option value="roiScore" ${this.sortColumn==="roiScore"?"selected":""}>ROI Score</option>
            </select>
            <button class="sort-direction" id="sortDirection" aria-label="Toggle sort direction" title="${this.sortDirection==="asc"?"Ascending":"Descending"}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="${this.sortDirection==="desc"?"rotated":""}">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="results-info">
          <span class="results-count">${this.filteredProducts.length} product${this.filteredProducts.length!==1?"s":""}</span>
          ${this.searchQuery?`<span class="search-query">matching "${this.searchQuery}"</span>`:""}
        </div>

        <!-- Main Content -->
        <div class="matrix-content" id="matrixContent">
          ${this.getDesktopView()}
        </div>

        <!-- Mobile Card View -->
        <div class="matrix-mobile-view" id="mobileView" style="display: none;">
          ${this.getMobileCards()}
        </div>
      </div>

      <!-- Buy Modal -->
      <div class="matrix-modal" id="buyModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-overlay" id="modalOverlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modalTitle">Purchase Options</h2>
            <button class="modal-close" id="modalClose" aria-label="Close modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body" id="modalBody">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>

      <!-- Full Specs Modal for Mobile -->
      <div class="matrix-modal" id="specsModal" role="dialog" aria-modal="true" aria-labelledby="specsModalTitle">
        <div class="modal-overlay" id="specsModalOverlay"></div>
        <div class="modal-content modal-specs">
          <div class="modal-header">
            <h2 id="specsModalTitle">Full Specifications</h2>
            <button class="modal-close" id="specsModalClose" aria-label="Close modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body" id="specsModalBody">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
    `;const e=this.container.querySelector("#categoryPills");e&&(e.innerHTML=this.getCategoryPills()),this.updateViews()}getDesktopView(){return`
      <div class="matrix-table-wrapper">
        <table class="matrix-table" id="matrixTable">
          <thead>
            <tr>
              <th class="th-product" scope="col">
                <div class="th-content">
                  <span class="th-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                  </span>
                  <button class="th-sort-btn" data-column="name" aria-label="Sort by name">
                    Product
                    <svg class="sort-arrow ${this.sortColumn==="name"?"active":""} ${this.sortDirection==="desc"?"desc":""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-brand" scope="col">
                <div class="th-content">
                  <button class="th-sort-btn" data-column="brand" aria-label="Sort by brand">
                    Brand
                    <svg class="sort-arrow ${this.sortColumn==="brand"?"active":""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-specs" scope="col">
                <div class="th-content">
                  <button class="th-sort-btn" data-column="specs" aria-label="Sort by specs" disabled>
                    Key Specifications
                  </button>
                </div>
              </th>
              <th class="th-price" scope="col">
                <div class="th-content">
                  <button class="th-sort-btn" data-column="priceUsd" aria-label="Sort by price">
                    Price (USD)
                    <svg class="sort-arrow ${this.sortColumn==="priceUsd"?"active":""} ${this.sortDirection==="desc"?"desc":""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-roi" scope="col">
                <div class="th-content">
                  <button class="th-sort-btn" data-column="roiScore" aria-label="Sort by ROI">
                    ROI Score
                    <svg class="sort-arrow ${this.sortColumn==="roiScore"?"active":""} ${this.sortDirection==="desc"?"desc":""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="th-network" scope="col">
                <div class="th-content">
                  <span class="th-label">Network</span>
                </div>
              </th>
              <th class="th-action" scope="col">
                <div class="th-content">
                  <span class="th-label">Action</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody id="tableBody">
            ${this.getTableRows()}
          </tbody>
        </table>
      </div>
    `}getTableRows(){return this.filteredProducts.length===0?`
        <tr>
          <td colspan="7" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <p class="empty-text">No products match your search</p>
            <p class="empty-hint">Try adjusting your filters or search terms</p>
          </td>
        </tr>
      `:this.filteredProducts.map(e=>{const t=m(e.imageUrl,80),s=u(e.category);return`
        <tr class="matrix-row" data-id="${e.id}" data-category="${e.category}">
          <td class="td-product">
            <div class="product-cell">
              <div class="product-thumbnail">
                <img
                  src="${t}"
                  alt="${e.name}"
                  loading="lazy"
                  onerror="this.onerror=null;this.src='${s}';"
                  class="product-image"
                >
              </div>
              <div class="product-info">
                <h3 class="product-name">${this.escapeHtml(e.name)}</h3>
                <span class="product-brand">${this.escapeHtml(e.brand)}</span>
              </div>
            </div>
          </td>
          <td class="td-brand">${this.escapeHtml(e.brand)}</td>
          <td class="td-specs">
            <div class="specs-preview">
              ${this.getSpecsPreview(e.specs)}
            </div>
          </td>
          <td class="td-price">
            <span class="price-value">$${e.priceUsd.toLocaleString()}</span>
          </td>
          <td class="td-roi">
            <div class="roi-cell">
              <div class="roi-bar">
                <div class="roi-fill" style="width: ${e.roiScore}%; background: ${this.getRoiColor(e.roiScore)};"></div>
              </div>
              <span class="roi-value">${e.roiScore}</span>
            </div>
          </td>
          <td class="td-network">
            <span class="network-badge ${e.affiliateNetwork}">
              ${f(e.affiliateNetwork)}
            </span>
          </td>
          <td class="td-action">
            <div class="action-cell">
              <button
                class="btn-buy"
                data-id="${e.id}"
                aria-label="View purchase options for ${this.escapeHtml(e.name)}"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
                Buy
              </button>
              <div class="buy-dropdown" id="dropdown-${e.id}">
                <button class="btn-buy-primary" data-id="${e.id}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                  </svg>
                  View Options
                </button>
              </div>
            </div>
          </td>
        </tr>
      `}).join("")}getMobileCards(){return this.filteredProducts.length===0?`
        <div class="mobile-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <p>No products match your search</p>
        </div>
      `:this.filteredProducts.map(e=>{const t=m(e.imageUrl,400),s=u(e.category);return`
        <div class="mobile-card" data-id="${e.id}">
          <div class="mobile-card-image">
            <img
              src="${t}"
              alt="${e.name}"
              loading="lazy"
              onerror="this.onerror=null;this.src='${s}';"
              class="mobile-image"
            >
            <span class="mobile-category-badge">${e.category}</span>
          </div>
          <div class="mobile-card-body">
            <h3 class="mobile-card-title">${this.escapeHtml(e.name)}</h3>
            <p class="mobile-card-brand">${this.escapeHtml(e.brand)}</p>

            <div class="mobile-card-specs">
              ${this.getMobileSpecs(e.specs)}
            </div>

            <div class="mobile-card-footer">
              <div class="mobile-price">
                <span class="price-value">$${e.priceUsd.toLocaleString()}</span>
              </div>
              <div class="mobile-roi">
                <span class="roi-label">ROI</span>
                <span class="roi-value">${e.roiScore}/100</span>
              </div>
            </div>

            <button
              class="btn-fullspecs"
              data-id="${e.id}"
              aria-label="View full specifications for ${this.escapeHtml(e.name)}"
            >
              Full Specs
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </button>
          </div>
        </div>
      `}).join("")}getSpecsPreview(e){return!e||Object.keys(e).length===0?'<span class="specs-none">No specs</span>':Object.entries(e).slice(0,3).map(([s,a])=>`
      <div class="spec-item">
        <span class="spec-key">${this.formatSpecKey(s)}:</span>
        <span class="spec-value">${this.formatSpecValue(a)}</span>
      </div>
    `).join("")}getMobileSpecs(e){return!e||Object.keys(e).length===0?'<span class="specs-none">No specifications available</span>':Object.entries(e).map(([t,s])=>`
      <div class="mobile-spec">
        <span class="mobile-spec-key">${this.formatSpecKey(t)}</span>
        <span class="mobile-spec-value">${this.formatSpecValue(s)}</span>
      </div>
    `).join("")}formatSpecKey(e){return e.replace(/_/g," ").replace(/([A-Z])/g," $1").replace(/^./,t=>t.toUpperCase()).trim()}formatSpecValue(e){return e===!0?"Yes":e===!1?"No":typeof e=="string"?e:String(e)}getRoiColor(e){return e>=80?"#10B981":e>=60?"#0EA5E9":e>=40?"#F59E0B":"#EF4444"}getCategoryPills(){return[...new Set(this.products.map(t=>t.category))].map(t=>`
      <button
        class="category-pill ${this.selectedCategory===t?"active":""}"
        data-category="${this.escapeHtml(t)}"
        role="tab"
        aria-selected="${this.selectedCategory===t}"
      >
        ${this.escapeHtml(t)}
      </button>
    `).join("")}getCategoryCount(){return new Set(this.products.map(e=>e.category)).size}getPriceRange(){if(this.products.length===0)return"$0";const e=this.products.map(a=>a.priceUsd),t=Math.min(...e),s=Math.max(...e);return t===s?`$${t.toLocaleString()}`:`$${t.toLocaleString()} - $${s.toLocaleString()}`}escapeHtml(e){if(typeof e!="string")return String(e);const t=document.createElement("div");return t.textContent=e,t.innerHTML}attachEventListeners(){var i,l,n,y;const e=this.container.querySelector("#searchInput"),t=this.container.querySelector("#searchClear");e==null||e.addEventListener("input",o=>{this.searchQuery=o.target.value.trim().toLowerCase(),t.style.display=this.searchQuery?"flex":"none",this.applyFilters()}),t==null||t.addEventListener("click",()=>{e.value="",this.searchQuery="",t.style.display="none",this.applyFilters()}),this.container.querySelectorAll(".category-pill").forEach(o=>{o.addEventListener("click",()=>{this.selectedCategory=o.dataset.category,this.container.querySelectorAll(".category-pill").forEach(c=>{c.classList.toggle("active",c.dataset.category===this.selectedCategory),c.setAttribute("aria-selected",c.dataset.category===this.selectedCategory)}),this.applyFilters()})});const s=this.container.querySelector("#sortSelect");s==null||s.addEventListener("change",o=>{this.sortColumn=o.target.value,this.sortDirection="asc",this.applyFilters(),this.updateSortIndicators()});const a=this.container.querySelector("#sortDirection");a==null||a.addEventListener("click",()=>{this.sortDirection=this.sortDirection==="asc"?"desc":"asc",this.applyFilters(),this.updateSortIndicators()}),this.container.querySelectorAll(".th-sort-btn").forEach(o=>{o.addEventListener("click",c=>{const d=o.dataset.column;if(d==="specs")return;const p=d===this.sortColumn;this.sortColumn=d,this.sortDirection=p&&this.sortDirection==="asc"?"desc":"asc",this.applyFilters(),this.updateSortIndicators()})}),this.container.querySelectorAll(".btn-buy, .btn-buy-primary").forEach(o=>{o.addEventListener("click",c=>{const d=o.dataset.id,p=this.products.find(g=>g.id===d);p&&this.showBuyModal(p)})}),this.container.querySelectorAll(".btn-fullspecs").forEach(o=>{o.addEventListener("click",c=>{const d=o.dataset.id,p=this.products.find(g=>g.id===d);p&&this.showSpecsModal(p)})}),(i=document.getElementById("modalClose"))==null||i.addEventListener("click",()=>this.hideModal("buyModal")),(l=document.getElementById("modalOverlay"))==null||l.addEventListener("click",()=>this.hideModal("buyModal")),(n=document.getElementById("specsModalClose"))==null||n.addEventListener("click",()=>this.hideModal("specsModal")),(y=document.getElementById("specsModalOverlay"))==null||y.addEventListener("click",()=>this.hideModal("specsModal")),document.addEventListener("keydown",o=>{var c;o.key==="Escape"&&(this.hideModal("buyModal"),this.hideModal("specsModal")),(o.ctrlKey||o.metaKey)&&o.key==="k"&&(o.preventDefault(),(c=this.container.querySelector("#searchInput"))==null||c.focus())}),this.handleResize(),window.addEventListener("resize",()=>this.handleResize())}updateSortIndicators(){this.container.querySelectorAll(".th-sort-btn").forEach(t=>{const s=t.dataset.column,a=t.querySelector(".sort-arrow");a&&(a.classList.toggle("active",s===this.sortColumn),a.classList.toggle("desc",this.sortDirection==="desc"))});const e=this.container.querySelector("#sortDirection svg");e&&e.classList.toggle("rotated",this.sortDirection==="desc")}applyFilters(){this.selectedCategory!=="all"?this.filteredProducts=this.products.filter(e=>e.category===this.selectedCategory):this.filteredProducts=[...this.products],this.searchQuery&&(this.filteredProducts=this.filteredProducts.filter(e=>[e.name,e.brand,e.category,e.specs?JSON.stringify(e.specs):"",e.affiliateNetwork,e.merchantId].join(" ").toLowerCase().includes(this.searchQuery))),this.sortProducts(),this.updateViews()}sortProducts(){this.filteredProducts.sort((e,t)=>{let s,a;switch(this.sortColumn){case"name":return s=e.name.toLowerCase(),a=t.name.toLowerCase(),this.sortDirection==="asc"?s.localeCompare(a):a.localeCompare(s);case"brand":return s=e.brand.toLowerCase(),a=t.brand.toLowerCase(),this.sortDirection==="asc"?s.localeCompare(a):a.localeCompare(s);case"priceUsd":return s=e.priceUsd,a=t.priceUsd,this.sortDirection==="asc"?s-a:a-s;case"roiScore":return s=e.roiScore,a=t.roiScore,this.sortDirection==="asc"?s-a:a-s;default:return 0}})}updateViews(){const e=this.container.querySelector("#matrixContent"),t=this.container.querySelector("#mobileView");e&&(e.innerHTML=this.getDesktopView()),t&&(t.innerHTML=this.getMobileCards());const s=this.container.querySelector("#tableBody");s&&(s.innerHTML=this.getTableRows()),this.updateSortIndicators(),this.attachBuyDropdownHandlers()}attachBuyDropdownHandlers(){this.container.querySelectorAll(".btn-buy").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const s=e.dataset.id,a=this.products.find(i=>i.id===s);a&&this.showBuyModal(a)})}),this.container.querySelectorAll(".btn-buy-primary, .btn-buy-primary-clone").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const s=e.dataset.id,a=this.products.find(i=>i.id===s);a&&this.showBuyModal(a)})})}handleResize(){const e=this.container.querySelector("#mobileView"),t=this.container.querySelector("#matrixContent");window.innerWidth<768?(e&&(e.style.display="block"),t&&(t.style.display="none")):(window.innerWidth<1024,e&&(e.style.display="none"),t&&(t.style.display="block"))}showBuyModal(e){const t=document.getElementById("buyModal"),s=document.getElementById("modalBody"),a=document.getElementById("modalTitle");if(!t||!s)return;a.textContent=`${e.name} - Purchase Options`;const i=M(e),l=f(e.affiliateNetwork);if(s.innerHTML=`
      <div class="modal-product">
        <div class="modal-product-image">
          <img
            src="${m(e.imageUrl,200)}"
            alt="${e.name}"
            onerror="this.onerror=null;this.src='${u(e.category)}';"
          >
        </div>
        <div class="modal-product-info">
          <span class="modal-product-brand">${this.escapeHtml(e.brand)}</span>
          <h3 class="modal-product-name">${this.escapeHtml(e.name)}</h3>
          <p class="modal-product-price">$${e.priceUsd.toLocaleString()}</p>
        </div>
      </div>

      <div class="modal-links">
        <div class="modal-link-item">
          <div class="modal-link-label">
            <span class="link-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </span>
            <span>Direct OEM Link</span>
          </div>
          <a
            href="${e.directUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="modal-link-btn"
          >
            Open in New Tab
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>

        ${e.affiliateNetwork!=="none"?`
        <div class="modal-link-item">
          <div class="modal-link-label">
            <span class="link-icon link-icon-affiliate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
            </span>
            <span>${l} Affiliate Link</span>
            <span class="affiliate-note">Supports our work</span>
          </div>
          <a
            href="${i}"
            target="_blank"
            rel="noopener noreferrer"
            class="modal-link-btn modal-link-btn-affiliate"
          >
            Visit via ${l}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
        `:""}
      </div>

      <div class="modal-footer">
        <p class="modal-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Clicking affiliate links may earn us a commission at no extra cost to you.
        </p>
      </div>
    `,t.style.display="flex",e.affiliateNetwork!=="none"){const n=s.querySelector(".modal-link-btn-affiliate");n&&(n.href=i)}}hideModal(e){const t=document.getElementById(e);t&&(t.style.display="none")}showSpecsModal(e){const t=document.getElementById("specsModal"),s=document.getElementById("specsModalBody"),a=document.getElementById("specsModalTitle");if(!t||!s)return;a.textContent=`${e.name} - Full Specifications`;const i=e.specs&&Object.keys(e.specs).length>0?Object.entries(e.specs).map(([l,n])=>`
        <div class="specs-row">
          <span class="specs-key">${this.formatSpecKey(l)}</span>
          <span class="specs-value">${this.formatSpecValue(n)}</span>
        </div>
      `).join(""):'<p class="no-specs">No specifications available</p>';s.innerHTML=`
      <div class="specs-header">
        <img
          src="${m(e.imageUrl,120)}"
          alt="${e.name}"
          onerror="this.onerror=null;this.src='${u(e.category)}';"
          class="specs-image"
        >
        <div class="specs-meta">
          <span class="specs-brand">${this.escapeHtml(e.brand)}</span>
          <span class="specs-category">${this.escapeHtml(e.category)}</span>
        </div>
      </div>

      <div class="specs-content">
        <div class="specs-list">
          ${i}
        </div>

        <div class="specs-footer">
          <div class="specs-price">
            <span class="price-label">Price</span>
            <span class="price-value">$${e.priceUsd.toLocaleString()}</span>
          </div>
          <div class="specs-roi">
            <span class="roi-label">ROI Score</span>
            <span class="roi-value">${e.roiScore}/100</span>
          </div>
          <div class="specs-network">
            <span class="network-label">Network</span>
            <span class="network-value">${f(e.affiliateNetwork)}</span>
          </div>

          <a
            href="${e.directUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-specs-buy"
          >
            Buy Now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    `,t.style.display="flex"}}const v=[{id:"creality-k1-max",name:"Creality K1 Max",brand:"Creality",category:"3D Printers",priceUsd:999,directUrl:"https://www.creality.com/products/k1-max",imageUrl:"https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=400&h=400&fit=crop",affiliateNetwork:"amazon",merchantId:"B0CKWV1JHZ",roiScore:78,specs:{print_volume:"220 × 220 × 250 mm",layer_height:"0.05 – 0.5 mm",nozzle_temp:"260 – 300 °C",bed_temp:"up to 100 °C",filament:"PLA, PETG, ABS, ASA, PC, Nylon, TPU",print_speed:"up to 600 mm/s",acceleration:"up to 20,000 mm/s²",connectivity:"WiFi, USB-C, Creality OS",auto_calibration:!0,camera:"HD camera with AI failure detection"}},{id:"prusa-xl",name:"Prusa XL",brand:"Prusa Research",category:"3D Printers",priceUsd:2499,directUrl:"https://www.prusa3d.com/product/prusa-xl/",imageUrl:"https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1?w=400&h=400&fit=crop",affiliateNetwork:"none",merchantId:"prusa-direct",roiScore:82,specs:{print_volume:"360 × 360 × 370 mm",layer_height:"0.02 – 0.5 mm",nozzle_temp:"up to 300 °C",bed_temp:"up to 120 °C",filament:"PLA, PETG, ABS, ASA, PC, Nylon, PEEK, PEKK",print_speed:"up to 600 mm/s",core_arms:"5-axis CORE Kinematics",auto_calibration:!0,filament_sensor:"Runout sensor with pause on empty",dual_nozzle:"Oxide textured stainless steel"}},{id:"bambu-lab-x1c",name:"Bambu Lab X1 Carbon",brand:"Bambu Lab",category:"3D Printers",priceUsd:1899,directUrl:"https://www.bambulab.com/en-us/products/x1c",imageUrl:"https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=400&h=400&fit=crop",affiliateNetwork:"amazon",merchantId:"B0BJGJXQK5",roiScore:75,specs:{print_volume:"256 × 256 × 256 mm",layer_height:"0.01 – 0.5 mm",nozzle_temp:"up to 300 °C",bed_temp:"up to 110 °C",filament:"PLA, PETG, ABS, ASA, PC, Nylon, Carbon Fiber filled",print_speed:"up to 500 mm/s",laser_meter:"Built-in LiDAR for auto-bed leveling",ai_camera:"AI failure detection with spaghetti detection",multi_machine:"Supported via Bambu Cloud",laser_engraver:"Optional 10W laser module"}},{id:"xtool-p2-50w",name:"xTool P2 50W",brand:"xTool",category:"CNC & Laser Cutters",priceUsd:4999,directUrl:"https://www.xtool.com/products/xtool-p2-50w-laser-cutter",imageUrl:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",affiliateNetwork:"shareasale",merchantId:"xtool",roiScore:68,specs:{laser_power:"50W (120W peak)",working_area:"400 × 400 mm",engraving_speed:"up to 1000 mm/s",cutting_speed:"up to 600 mm/s",cutting_thickness:"up to 25mm basswood, 8mm acrylic",blue_crystal_module:"455nm for finer cutting",red_violet_module:"405nm for marking",auto_focus:!0,camera:"5MP wide-angle camera",air_assist:"Built-in air pump",rotation_raster:"360° rotary attachment supported"}},{id:"glowforge-plus",name:"Glowforge Pro",brand:"Glowforge",category:"CNC & Laser Cutters",priceUsd:5995,directUrl:"https://www.glowforge.com/pro/",imageUrl:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",affiliateNetwork:"none",merchantId:"glowforge-direct",roiScore:62,specs:{laser_power:"50W (claimed)",working_area:"420 × 320 mm (16.5 × 12.6 in)",dpi:"1000 dpi",material_thickness:"Up to 0.45 in hardwood, 0.25 in acrylic",camera:"Autofocus camera with print preview",honeycomb:"Included honeycomb bed",smart_squeeze:"Smart squeeze for material handling",air_assist:"Integrated air assist",encoders:"Linear encoders for precision",wifi:"WiFi connectivity"}},{id:"ecoflow-delta-pro-3",name:"EcoFlow Delta Pro 3",brand:"EcoFlow",category:"Off-Grid Solar & Power",priceUsd:3599,directUrl:"https://www.ecoflow.com/products/delta-pro-3",imageUrl:"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",affiliateNetwork:"amazon",merchantId:"B0CH7VQXZG",roiScore:88,specs:{capacity:"4096 Wh (expandable to 12 kWh)",output_ac:"3600W continuous (7200W boost)",output_voltage:"120V / 240V",charge_time:"0-80% in 50 minutes",solar_input:"Up to 3000W MPPT","battery chemistry":"LiFePO4",cycle_life:"6000 cycles to 80%",inverter:"Pure sine wave",app_control:!0,smart_home:"Grid-tie capable with EcoFlow Smart Home Panel"}},{id:"bluetti-ac200l",name:"Bluetti AC200L",brand:"Bluetti",category:"Off-Grid Solar & Power",priceUsd:1499,directUrl:"https://www.bluettipower.com/products/bluetti-ac200l",imageUrl:"https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop",affiliateNetwork:"awin",merchantId:"bluetti-ac200l",roiScore:84,specs:{capacity:"2048 Wh (expandable to 4096 Wh)",output_ac:"2200W continuous (4800W surge)",output_voltage:"120V",charge_time:"0-80% in 50 minutes (AC)",solar_input:"Up to 900W MPPT",battery_chemistry:"LiFePO4",cycle_life:"3500+ cycles to 80%",inverter:"Pure sine wave",battery_management:"Smart BMS",wifi_bluetooth:"WiFi + Bluetooth app control"}},{id:"jackery-explorer-2000",name:"Jackery Explorer 2000 Plus",brand:"Jackery",category:"Off-Grid Solar & Power",priceUsd:1999,directUrl:"https://www.jackery.com/products/explorer-2000-plus",imageUrl:"https://images.unsplash.com/photo-1585349868034-691062baac3c?w=400&h=400&fit=crop",affiliateNetwork:"amazon",merchantId:"B0BQN7HPKT",roiScore:80,specs:{capacity:"2048 Wh (expandable to 12 kWh)",output_ac:"2000W continuous (4000W surge)",output_voltage:"120V",charge_time:"0-80% in 1.7 hours (AC)",solar_input:"Up to 1000W",battery_chemistry:"LiFePO4",cycle_life:"4000 cycles to 80%",inverter:"Pure sine wave",battery_management:"Smart BMS",pass_through:"UPS function for seamless backup"}},{id:"dji-matrice-350-rtk",name:"DJI Matrice 350 RTK",brand:"DJI",category:"Thermal & Mapping Drones",priceUsd:13499,directUrl:"https://www.dji.com/matrice-350-rtk",imageUrl:"https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",affiliateNetwork:"none",merchantId:"dji-direct",roiScore:91,specs:{max_flight_time:"55 minutes",max_speed:"72 km/h (no wind)",max_wind_resistance:"12 m/s (Level 5)",max_takeoff_altitude:"6000 m",horizon_lib:"Optional FLIR Duo Pro R thermal payload",payload_capacity:"2.7 kg",obstacle_sensing:"Forward, backward, left, right",transmission:"O3 Enterprise 5 km",dual_gps:"RTK positioning ±1 cm",battery_slots:"2 TB65 intelligent batteries"}},{id:"autel-evo-ii-dual",name:"Autel EVO II Dual 640T V3",brand:"Autel Robotics",category:"Thermal & Mapping Drones",priceUsd:5999,directUrl:"https://www.autelrobotics.com/evO-II-dual-640T-V3",imageUrl:"https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop",affiliateNetwork:"amazon",merchantId:"B09VQXZ8RT",roiScore:76,specs:{max_flight_time:"40 minutes",max_speed:"68 km/h",max_wind_resistance:"12 m/s",max_takeoff_altitude:"4500 m",thermal_resolution:"640 × 512 @ 30 Hz",thermal_sensitivity:"< 50 mK",zoom_camera:'1/2\\" CMOS 48MP, 10x optical zoom',obstacle_sensing:"6-way sensing",transmission:"15 km (FCC)",rtk:"Optional RG-N1 RTK module"}},{id:"dji-mavic-3-enterprise",name:"DJI Mavic 3 Enterprise",brand:"DJI",category:"Thermal & Mapping Drones",priceUsd:4139,directUrl:"https://www.dji.com/mavic-3-enterprise",imageUrl:"https://images.unsplash.com/photo-1552820728-8b83bb6b57c4?w=400&h=400&fit=crop",affiliateNetwork:"none",merchantId:"dji-direct",roiScore:85,specs:{max_flight_time:"45 minutes",max_speed:"75.6 km/h (max cruise)",thermal_option:"M3T with 640×512 thermal (optional)",camera:"4/3 CMOS 20MP, Hasselblad",zoom:"56x hybrid zoom (28x lossless)",obstacle_sensing:"Omnidirectional",transmission:"O3 Enterprise (15 km)",rtk_module:"Optional D-RTK 2 Mobile Station",light_module:"DJI L1/L2 LiDAR optional"}},{id:"lamarzocco-linea-micra",name:"La Marzocco Linea Micra",brand:"La Marzocco",category:"Prosumer Espresso",priceUsd:2499,directUrl:"https://www.lamarzocco.com/linea-micra/",imageUrl:"https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",affiliateNetwork:"shareasale",merchantId:"lamarzocco",roiScore:72,specs:{brew_pressure:"9 bar (preset)",boiler:"Dual thermoblock, PID controlled",temperature_stability:"±1°C",head_temperature:"93°C / 199.4°F (adjustable via app)",group_head:"Saturated Brew Group",water_filter:"APF in-tank water filtration",tank_capacity:"2.5 L",doser:"Manual doser with adjustable pre-infusion",connectivity:"WiFi + Bluetooth for app control",app_features:"Shot profiling, diagnostics, firmware updates",dimensions:"260 × 410 × 505 mm",weight:"24.5 kg"}},{id:"rocket-espresso-appartamento",name:"Rocket Espresso Appartamento",brand:"Rocket Espresso",category:"Prosumer Espresso",priceUsd:2995,directUrl:"https://www.rocket-espresso.com/appartamento.html",imageUrl:"https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop",affiliateNetwork:"none",merchantId:"rocket-direct",roiScore:70,specs:{brew_pressure:"9 bar (manual pump)",boiler:"1.25 L stainless steel thermosiphon",temperature_stability:"PID digital control",group_head:"57mm BRAlternatively saturated",ports_server:"Hot water spout with steam wand",residual_toggle:"Commercial high-pressure pump",pressure_stat:"External gauge and pressure stat",thermal_hysteresis:"Manual PID adjust",dimensions:"400 × 330 × 400 mm",weight:"18 kg"}},{id:"eversys-mycoffeelab-center",name:"eversys myCoffeelab Center",brand:"Eversys",category:"Prosumer Espresso",priceUsd:3490,directUrl:"https://www.eversys.com/mycoffeelab-center",imageUrl:"https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop",affiliateNetwork:"amazon",merchantId:"B0CLXKJQ7P",roiScore:68,specs:{brew_pressure:"Variable 0-12 bar (digital)",temperature_control:"0.1°C precision digital",shot_profiling:"Multi-profile with cloud sync",water_quality:"Integrated TDS sensor",connectivity:"WiFi + Ethernet + USB",app:"eversys myCoffeelab app",flow_meter:"Peristaltic flow measurement",temperature_probe:"Dual NTC probes",dimensions:"320 × 510 × 420 mm",warranty:"3 years comprehensive"}},{id:"tern-gsd-s10",name:"Tern GSD S10",brand:"Tern",category:"Utility EVs",priceUsd:5299,directUrl:"https://ternbicycles.com/products/gsd-s10",imageUrl:"https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",affiliateNetwork:"shareasale",merchantId:"tern-gsd-s10",roiScore:89,specs:{motor:"TQ HPR50 500W mid-drive",battery:"36V 20.7 Ah (745 Wh)",range:"up to 112 km (assist dependent)",max_speed:"45 km/h (28 mph S-Pedelec mode)",cargo_capacity:"95 kg combined",cargo_short_john:"Front Rack GSD Short John compatible",frame:'High-tensile steel with 20" wheels',gearbox:"Shimano Alfine 8-speed",lights:"Integrated USB rechargeable LED",brakes:"Tektro hydraulic disc (180mm front, 160mm rear)",kicking:"Quick-release rear rack and cargo platform"}},{id:"cargo-bike-riese-muller",name:"Riese & Müller Load 60",brand:"Riese & Müller",category:"Utility EVs",priceUsd:6499,directUrl:"https://www.r-m-pe.com/usa_en/produkte-lastenfaehren/lastenfahrrad-load.html",imageUrl:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",affiliateNetwork:"none",merchantId:"rm-direct",roiScore:74,specs:{motor:"Bosch Performance Line CX 75 Nm",battery:"500 Wh or 625 Wh Range Extender",range:"up to 180 km (Eco mode)",max_speed:"25 km/h (pedelec) / 45 km/h (Speed pedelec)",cargo_capacity:"80 kg rear, 20 kg front",frame_geometry:"Dual deck, low step-through",suspension:"Lockout front fork, rear elastomer",lights:"Bosch integrated LED",brakes:"Shimano hydraulic disc 180/160mm",gears:"Shimano Nexus 7D or Enviolo CVP"}},{id:"ripmow-450",name:"RIPMOw 450",brand:"Worx",category:"Utility EVs",priceUsd:1299,directUrl:"https://www.worx.com/products/landroid-m",imageUrl:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",affiliateNetwork:"amazon",merchantId:"B07YJ92CFV",roiScore:81,specs:{motor:"Brushless 20V MAX",cutting_width:"22 cm",cutting_height:"20 – 60 mm",tackle:"Nyline cutting system, 180° pivoting",battery:"20V 6.0 Ah or 4.0 Ah (up to 2.5 hours)",rain_sensor:"Automatic return to charging station",anti_theft:"GPS tracking (optional module)",slope_handling:"Handles slopes up to 70%",mulching:"Discharge mulching plug included",app_control:"Worx Landroid app with boundary setup"}}];function A(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{w()}):w()}function w(){const r=document.getElementById("matrixContainer");if(!r){console.error("Matrix container not found");return}try{const e=new I("#matrixContainer",v);window.__matrixApp=e,console.log(`Prosumer Matrix initialized with ${v.length} products`)}catch(e){console.error("Failed to initialize MatrixApp:",e),r.innerHTML=`
      <div class="error-state">
        <h2>Initialization Error</h2>
        <p>Failed to load the specification matrix. Please refresh the page.</p>
        <details>
          <summary>Error details</summary>
          <pre>${e.message}</pre>
        </details>
      </div>
    `}}A();
