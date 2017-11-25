import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Index/Login'
import Index from '@/components/Index/Index'
import Home from '@/components/Home/Home'
import Logging from '@/components/Home/Logging'
import History from '@/components/Home/History'
import Member from '@/components/Home/Member'
import Application from '@/components/Home/Application'
import Search from '@/components/Search/Search'
import Create from '@/components/Search/Create'
import TopBar from '@/components/common/Main'
import Recognition from '@/components/Recognition/Recognition'
import Structure from '@/components/Structure/Structure'
import StrNotext from '@/components/Structure/Notext'
import Manage from '@/components/Manage/Manage'
import ManageItem from '@/components/Manage/ManageItem'
import Import from '@/components/Manage/Import'
import Law from '@/components/Manage/Law'
import Case from '@/components/Manage/Case'
import MaintenanceEntity from '@/components/Maintenance/Entity'
import MaintenanceRelation from '@/components/Maintenance/Relation'
import MaintenanceNotext from '@/components/Maintenance/Notext'
import LawTag from '@/components/LawTag/LawTag'
import LawTagBuild from '@/components/LawTag/lawTagBuild'
import LawTagEdit from '@/components/LawTag/LawTagEdit'
import LawTagSearch from '@/components/LawTag/LawTagSearch'
import LawTagFix from '@/components/LawTag/LawTagFix'
import Layer from '@/components/Layer/Layer'
import LawTextTag from '@/components/LawTag/LawTextTag'
import Cause from '@/components/LawTag/Cause'
import LawTagMaintain from '@/components/LawTag/LawTagMaintain'
import CommonGraph from '@/components/commonGraph/commonGraph'
import NewGraph from '@/components/commonGraph/NewGraph'
import MergeTag from '@/components/common/mergeTag'
import Test from '@/components/Search/test'
import Admin from '@/components/Index/Admin'
import AdminGroup from '@/components/Admin/Group/Group'
import AdminApplication from '@/components/Admin/Application/Application'
import AdminMember from '@/components/Admin/Member/Member'
import actionPlan from '@/components/commonGraph/actionPlan'
import riskAss from '@/components/commonGraph/riskAss'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/index',
      component: Index,
      redirect: '/home/logging',
      children: [
        {
          path: '/search',
          component: Search
        },
        {
          path: '/create',
          component: Create
        },
        {
          path: '/layer',
          component: Layer
        },
        {
          path: '/main', component: TopBar,
          children: [
            {
              path: 'recognition',
              component: Recognition
            }, {
              path: 'structure',
              component: Structure,
            }
          ],
        },
        {
          path: '/home', component: Home,
          redirect: '/home/logging',
          children: [
            {
              path: 'logging',
              component: Logging,
            },
            {
              path: 'member',
              component: Member,
            },
            {
              path: 'history',
              component: History,
            },
            {
              path: 'application',
              component: Application,
            }
          ]
        },
        {
          path: '/strnotext',
          component: StrNotext,
        },
        {
          path: '/manage/manage',
          component: Manage
        },
        {
          path: '/manage/manage/item/:title',
          component: ManageItem
        },
        {
          path: '/manage/import',
          component: Import,
        },
        {
          path: '/manage/import/law',
          component: Law
        },
        {
          path: '/manage/import/case',
          component: Case
        },
        {
          path: '/maintenance/entity',
          component: MaintenanceEntity
        },
        {
          path: '/maintenance/relation',
          component: MaintenanceRelation
        },
        {
          path: '/cause',
          component: Cause
        },
        {
          path: '/commongraph',
          component: CommonGraph
        },
        {
          path: '/mergetag',
          component: MergeTag
        },
        {
          path: '/newgraph',
          component: NewGraph
        },
        {
          path: '/actionplan',
          component: actionPlan
        },
        {
          path: '/riskass',
          component: riskAss
        },
        {
          path: '/lawtag/lawtagmaintain',
          component: LawTagMaintain
        },
        {
          path: '/lawtag/lawtexttag',
          component: LawTextTag
        },
        {
          path: '/lawtag/lawtag',
          component: LawTag,
          children: [
            {
              path: '/lawtag/lawtagbuild',
              component: LawTagBuild
            },
            {
              path: '/lawtag/lawtagedit',
              component: LawTagEdit
            },
            {
              path: '/lawtag/lawtagfix',
              component: LawTagFix
            },
            {
              path: '/lawtag/cause',
              component: Cause
            },
            {
              path: '/lawtag/lawtagmaintain',
              component: LawTagMaintain
            },
            {
              path: '/lawtag/lawtagsearch',
              component: LawTagSearch
            }
          ]
        },
        {
          path: '/maintenance/notext',
          component: MaintenanceNotext
        }
      ]
    },
    {
      path: '/admin',
      component: Admin,
      children: [
        {
          path: '',
          component: AdminGroup,
        },
        {
          path: '/group',
          component: AdminGroup,
        },
        {
          path: '/application',
          component: AdminApplication,
        },
        {
          path: '/member',
          component: AdminMember,
        }
      ]
    },
    {
      path: '/test',
      component: Test
    }
  ]
})
