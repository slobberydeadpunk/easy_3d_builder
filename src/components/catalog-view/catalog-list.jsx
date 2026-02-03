import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CatalogItem from './catalog-item';
import CatalogBreadcrumb from './catalog-breadcrumb';
import CatalogPageItem from './catalog-page-item';
import CatalogTurnBackPageItem from './catalog-turn-back-page-item';
import ContentContainer from '../style/content-container';
import ContentTitle from '../style/content-title';
import * as SharedStyle from '../../shared-style';

const containerStyle = {
  position: 'fixed',
  width: 'calc(100% - 51px)',
  height: 'calc(100% - 20px)',
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  padding: SharedStyle.SPACING.xl,
  left: 50,
  overflowY: 'auto',
  overflowX: 'hidden',
  zIndex: 10,
  scrollbarWidth: 'thin',
  scrollbarColor: `${SharedStyle.PRIMARY_COLOR.hover} transparent`
};

const itemsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gridGap: SharedStyle.SPACING.lg,
  marginTop: SharedStyle.SPACING.lg
};

const searchContainer = {
  width: '100%',
  padding: SharedStyle.SPACING.md,
  background: SharedStyle.PRIMARY_COLOR.surface,
  border: '1px solid rgba(255, 255, 255, 0.06)',
  cursor: 'default',
  position: 'relative',
  boxShadow: SharedStyle.SHADOWS.sm,
  borderRadius: SharedStyle.RADIUS.lg,
  transition: SharedStyle.TRANSITIONS.normal,
  marginBottom: SharedStyle.SPACING.lg,
  display: 'flex',
  alignItems: 'center',
  gap: SharedStyle.SPACING.md
};

const searchText = {
  color: SharedStyle.PRIMARY_COLOR.text_muted,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  whiteSpace: 'nowrap'
};

const searchInput = {
  flex: 1,
  height: '36px',
  margin: '0',
  padding: '0 12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: SharedStyle.RADIUS.md,
  backgroundColor: SharedStyle.PRIMARY_COLOR.input,
  color: SharedStyle.PRIMARY_COLOR.text_main,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  outline: 'none',
  transition: SharedStyle.TRANSITIONS.fast
};

const historyContainer = {
  ...searchContainer,
  flexWrap: 'wrap',
  cursor: 'default'
};

const historyElementStyle = {
  height: '32px',
  lineHeight: '32px',
  textAlign: 'center',
  borderRadius: SharedStyle.RADIUS.full,
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: 'rgba(59, 130, 246, 0.15)',
  color: SharedStyle.SECONDARY_COLOR.light,
  textTransform: 'capitalize',
  padding: '0 16px',
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  transition: SharedStyle.TRANSITIONS.fast,
  border: '1px solid transparent'
};

export default class CatalogList extends Component {

  constructor(props, context) {
    super(props);

    let page = props.state.catalog.page;
    let currentCategory = context.catalog.getCategory(page);
    let categoriesToDisplay = currentCategory.categories;
    let elementsToDisplay = currentCategory.elements.filter(element => element.info.visibility ? element.info.visibility.catalog : true );

    this.state = {
      categories: currentCategory.categories,
      elements: elementsToDisplay,
      matchString: '',
      matchedElements: []
    };
  }

  flattenCategories( categories ) {
    let toRet = [];

    for( let x = 0; x < categories.length; x++ )
    {
      let curr = categories[x];
      toRet = toRet.concat( curr.elements );
      if( curr.categories.length ) toRet = toRet.concat( this.flattenCategories ( curr.categories ) );
    }

    return toRet;
  }

  matcharray( text ) {

    let array = this.state.elements.concat( this.flattenCategories( this.state.categories ) );

    let filtered = [];

    if( text != '' ) {
      let regexp = new RegExp( text, 'i');
      for (let i = 0; i < array.length; i++) {
        if (regexp.test(array[i].info.title)) {
          filtered.push(array[i]);
        }
      }
    }

    this.setState({
      matchString: text,
      matchedElements: filtered
    });
  };

  select( element ) {

    switch (element.prototype) {
      case 'lines':
        this.context.linesActions.selectToolDrawingLine(element.name);
        break;
      case 'items':
        this.context.itemsActions.selectToolDrawingItem(element.name);
        break;
      case 'holes':
        this.context.holesActions.selectToolDrawingHole(element.name);
        break;
    }

    this.context.projectActions.pushLastSelectedCatalogElementToHistory(element);
  }

  render() {

    let page = this.props.state.catalog.page;
    let currentCategory = this.context.catalog.getCategory(page);
    let categoriesToDisplay = currentCategory.categories;
    let elementsToDisplay = currentCategory.elements.filter(element => element.info.visibility ? element.info.visibility.catalog : true );

    let breadcrumbComponent = null;

    if (page !== 'root') {

      let breadcrumbsNames = [];

      this.props.state.catalog.path.forEach(pathName => {
        breadcrumbsNames.push({
          name: this.context.catalog.getCategory(pathName).label,
          action: () => projectActions.goBackToCatalogPage(pathName)
        });
      });

      breadcrumbsNames.push({name: currentCategory.label, action: ''});

      breadcrumbComponent = (<CatalogBreadcrumb names={breadcrumbsNames}/>);
    }

    let pathSize = this.props.state.catalog.path.size;

    let turnBackButton = pathSize > 0 ? (
      <CatalogTurnBackPageItem key={pathSize} page={this.context.catalog.categories[this.props.state.catalog.path.get(pathSize - 1)]}/>) : null;


    let selectedHistory = this.props.state.get('selectedElementsHistory');
    let selectedHistoryElements = selectedHistory.map( ( el, ind ) =>
      <div key={ind} style={historyElementStyle} title={el.name} onClick={() => this.select(el) }>{el.name}</div>
    );

    return (
      <ContentContainer width={this.props.width} height={this.props.height} style={{...containerStyle, ...this.props.style}}>
        <ContentTitle>{this.context.translator.t('Catalog')}</ContentTitle>
        {breadcrumbComponent}
        <div style={searchContainer}>
          <span style={searchText}>{this.context.translator.t('Search Element')}</span>
          <input type="text" style={searchInput} onChange={( e ) => { this.matcharray( e.target.value ); } }/>
        </div>
        { selectedHistory.size ?
          <div style={historyContainer}>
            <span>{this.context.translator.t('Last Selected')}</span>
            {selectedHistoryElements}
          </div> :
          null
        }
        <div style={itemsStyle}>
          {
            this.state.matchString === '' ? [
              turnBackButton,
              categoriesToDisplay.map(cat => <CatalogPageItem key={cat.name} page={cat} oldPage={currentCategory}/>),
              elementsToDisplay.map(elem => <CatalogItem key={elem.name} element={elem}/>)
            ] :
            this.state.matchedElements.map(elem => <CatalogItem key={elem.name} element={elem}/>)
          }
        </div>
      </ContentContainer>
    )
  }
}

CatalogList.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.object
};

CatalogList.contextTypes = {
  catalog: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
